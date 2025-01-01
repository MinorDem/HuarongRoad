export interface TileI {
  id: number;
  name: string;
}

export type BoardI = (TileI | null)[][];

export interface UserI {
  username: string;
  uuid: string;
}

export interface LeaderboardEntryI {
  username: string;
  uuid: string;
  time: number;
  date: string;
}

export const testState: BoardI = [
  [
    { id: 1, name: "Q" },
    { id: 2, name: "S3" },
    { id: 3, name: "AWS" },
  ],
  [
    { id: 4, name: "Game" },
    { id: 8, name: "DynamoDB" },
    { id: 5, name: "Cloud" },
  ],
  [{ id: 7, name: "Amplify" }, null, { id: 6, name: "Lambda" }],
];

export const orderedState: BoardI = [
  [
    { id: 1, name: "Q" },
    { id: 2, name: "S3" },
    { id: 3, name: "AWS" },
  ],
  [
    { id: 4, name: "Game" },
    { id: 5, name: "Cloud" },
    { id: 6, name: "Lambda" },
  ],
  [{ id: 7, name: "Amplify" }, { id: 8, name: "DynamoDB" }, null],
];
