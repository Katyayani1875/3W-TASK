// A humanly written comment:
// This is the main leaderboard component. It takes the full list of users,
// intelligently separates the top 3 for the podium, and maps the rest
// to the list component. This keeps the logic clean and separated.

import { Card, CardContent } from "@/components/ui/card"; // 👈 ADD THIS LINE
import { PodiumItem } from "./PodiumItem";
import { LeaderboardListItem } from "./LeaderboardListItem";

/**
 * @param {{leaderboardData: Array<{ _id: string, name: string, totalPoints: number }>}} props
 */
export function Leaderboard({ leaderboardData }) {
  if (!leaderboardData || leaderboardData.length === 0) {
    return <p className="text-center text-muted-foreground mt-10">Leaderboard is loading...</p>;
  }

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  const podiumUsers = [
    topThree.find((u, i) => i === 1),
    topThree.find((u, i) => i === 0),
    topThree.find((u, i) => i === 2),
  ].filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Podium Section */}
      {/* This is the line (around line 30) that was causing the error */}
      <Card className="bg-gradient-to-b from-violet-200 to-background dark:from-violet-900/50 dark:to-background p-4 mb-6">
        <CardContent className="p-0 flex justify-around items-end h-56">
          {podiumUsers.map((user, index) => {
            let rank = index === 0 ? 2 : index === 1 ? 1 : 3;
            return <PodiumItem key={user._id} user={user} rank={rank} />;
          })}
        </CardContent>
      </Card>

      {/* List for the rest */}
      <ul className="space-y-3">
        {restOfUsers.map((user, index) => (
          <LeaderboardListItem key={user._id} user={user} rank={index + 4} />
        ))}
      </ul>
    </div>
  );
}