// A humanly written comment:
// This component is for every user *not* on the podium. It's a clean,
// repeatable list item that clearly shows rank, name, and points.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * @param {{user: { _id: string, name: string, totalPoints: number }, rank: number}} props
 */
export function LeaderboardListItem({ user, rank }) {
  const avatarUrl = `https://i.pravatar.cc/150?u=${user._id}`;
  return (
    <li className="flex items-center bg-card p-3 rounded-lg shadow-sm hover:bg-muted transition-colors duration-200">
      <span className="font-bold text-lg w-10 text-muted-foreground">{rank}</span>
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage src={avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="font-semibold text-card-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground">ID: ...{user._id.slice(-6)}</p>
      </div>
      <span className="font-bold text-lg text-primary">{user.totalPoints} 🔥</span>
    </li>
  );
}