import { Card, CardContent } from "@/components/ui/card";
import { PodiumItem } from "./PodiumItem"; 
import { LeaderboardListItem } from "./LeaderboardListItem";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, 
    },
  },
};

export function Leaderboard({ leaderboardData, isLoading = false, highlightedUserId }) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-3">
        <Skeleton className="h-56 w-full rounded-xl" />
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground mt-10 p-4 bg-card rounded-lg"
      >
        No users found. Add some users to start the competition!
      </motion.div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);
  const podiumUsers = [
    topThree.find((u, i) => i === 1), 
    topThree.find((u, i) => i === 0), 
    topThree.find((u, i) => i === 2), 
  ].filter(Boolean); 

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-4 mb-6 rounded-2xl bg-gradient-to-b from-violet-100 to-purple-50 dark:from-violet-900/20 dark:to-background">
        <CardContent className="p-0 flex justify-around items-end h-56">
          {podiumUsers.map((user) => {
            const rank = leaderboardData.findIndex(u => u._id === user._id) + 1;
            return <PodiumItem key={user._id} user={user} rank={rank} />;
          })}
        </CardContent>
      </Card>
      <motion.ul className="space-y-3" variants={containerVariants}>
        {restOfUsers.map((user, index) => (
          <LeaderboardListItem
            key={user._id}
            user={user}
            rank={index + 4}
            highlight={user._id === highlightedUserId}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
}