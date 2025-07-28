// A humanly written comment:
// This component is for a single user on the podium (top 3). It uses props
// to dynamically apply styles for 1st, 2nd, and 3rd place, creating a
// visually appealing and hierarchical podium effect.

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * @param {{user: { _id: string, name: string, totalPoints: number }, rank: 1 | 2 | 3}} props
 */
export function PodiumItem({ user, rank }) {
  const rankStyles = {
    1: {
      container: "order-2 h-52",
      avatar: "w-24 h-24 border-4 border-yellow-400",
      badge: "bg-yellow-400 text-yellow-900",
    },
    2: {
      container: "order-1 h-44 self-end",
      avatar: "w-20 h-20 border-4 border-slate-400",
      badge: "bg-slate-400 text-slate-900",
    },
    3: {
      container: "order-3 h-36 self-end",
      avatar: "w-16 h-16 border-4 border-orange-400",
      badge: "bg-orange-400 text-orange-900",
    },
  };

  const styles = rankStyles[rank];
  const avatarUrl = `https://i.pravatar.cc/150?u=${user._id}`;

  return (
    <div className={cn("flex flex-col items-center justify-end w-1/3", styles.container)}>
      <div className="relative">
        <Avatar className={cn("mb-2 shadow-lg", styles.avatar)}>
          <AvatarImage src={avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-md", styles.badge)}>
          {rank}
        </div>
      </div>
      <p className="font-bold text-lg text-card-foreground truncate w-full px-2">{user.name}</p>
      <p className="font-extrabold text-xl text-primary">{user.totalPoints} 🔥</p>
    </div>
  );
}