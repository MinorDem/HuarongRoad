import {
  CreateTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { LeaderboardEntryI } from "@/types";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "puzzle-leaderboard";

console.log(process.env.AWS_SECRET_ACCESS_KEY);
export const leaderboardService = {
  async addOrUpdateScore(entry: LeaderboardEntryI): Promise<boolean> {
    try {
      const { Item } = (await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { uuid: entry.uuid },
        })
      )) as unknown as { Item?: LeaderboardEntryI };

      if (!Item || Item.time > entry.time) {
        await docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: {
              ...entry,
              dummy: "ALL",
            },
          })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in addOrUpdateScore:", error);
      throw error;
    }
  },

  async getTopScores(limit = 10): Promise<LeaderboardEntryI[]> {
    try {
      const { Items = [] } = (await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "TimeIndex",
          KeyConditionExpression: "dummy = :dummy",
          ExpressionAttributeValues: {
            ":dummy": "ALL",
          },
          Limit: limit,
          ScanIndexForward: true,
        })
      )) as unknown as { Items: LeaderboardEntryI[] };

      return Items;
    } catch (error) {
      console.error("Error in getTopScores:", error);
      throw error;
    }
  },

  async getUserRank(uuid: string): Promise<number | null> {
    try {
      const allScores = await this.getTopScores();
      const rank = allScores.findIndex((score) => score.uuid === uuid) + 1;
      return rank > 0 ? rank : null;
    } catch (error) {
      console.error("Error in getUserRank:", error);
      throw error;
    }
  },
};

const initDynamoDB = async () => {
  try {
    // Step 1: Check if the table exists
    const listTablesCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listTablesCommand);

    if (TableNames && TableNames.includes(TABLE_NAME)) {
      console.log(`Table "${TABLE_NAME}" already exists.`);
      return;
    }

    // Step 2: Create the table with a global secondary index (GSI)
    const createTableCommand = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: "uuid", KeyType: "HASH" }], // Primary Key
      AttributeDefinitions: [
        { AttributeName: "uuid", AttributeType: "S" }, // Primary Key
        { AttributeName: "dummy", AttributeType: "S" }, // GSI Partition Key
        { AttributeName: "time", AttributeType: "N" }, // GSI Sort Key
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "TimeIndex",
          KeySchema: [
            { AttributeName: "dummy", KeyType: "HASH" },
            { AttributeName: "time", KeyType: "RANGE" },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    const result = await client.send(createTableCommand);
    console.log(`Table "${TABLE_NAME}" created successfully:`, result);
  } catch (error) {
    console.error("Error initializing DynamoDB:", error);
  }
};

initDynamoDB();
