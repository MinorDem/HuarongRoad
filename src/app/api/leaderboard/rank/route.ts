import { NextResponse } from "next/server";
import { leaderboardService } from "@/service/dynamoDBService";

export async function POST(req: Request) {
  console.log("POST /api/leaderboard/rank: Fetching user rank...");

  try {
    const body = await req.json();
    console.log("POST /api/leaderboard/rank: Received payload:", body);

    const { uuid } = body;
    if (!uuid) {
      console.warn("POST /api/leaderboard/rank: Missing UUID in request.");
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    const rank = await leaderboardService.getUserRank(uuid);
    console.log("POST /api/leaderboard/rank: Successfully fetched rank:", {
      uuid,
      rank,
    });

    return NextResponse.json({ rank });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return NextResponse.json(
      { error: "Failed to fetch user rank" },
      { status: 500 }
    );
  }
}
