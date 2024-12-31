import { NextResponse } from "next/server";
import { leaderboardService } from "@/service/dynamoDBService";

export async function GET() {
  console.log("GET /api/leaderboard: Fetching top scores...");

  try {
    const topScores = await leaderboardService.getTopScores();
    console.log("GET /api/leaderboard: Successfully fetched top scores.", {
      count: topScores.length,
      sample: topScores.slice(0, 3), // Only log the first 3 entries to avoid clutter
    });

    return NextResponse.json(topScores);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log("POST /api/leaderboard: Updating leaderboard...");

  try {
    const body = await req.json();
    console.log("POST /api/leaderboard: Received payload:", body);

    const updated = await leaderboardService.addOrUpdateScore(body);

    console.log("POST /api/leaderboard: Update operation result:", { updated });
    return NextResponse.json({ updated });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to update leaderboard" },
      { status: 500 }
    );
  }
}
