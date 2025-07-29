import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

const getAvatarUrl = (userId) => `https://i.pravatar.cc/150?u=${userId}`;

const getInitials = (name) => {
  const names = name.split(' ');
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
};

export function PodiumItem({ user, rank }) {
  const rankStyles = {
    1: {
      container: "order-2 h-52", 
      avatar: "w-24 h-24 border-4 border-primary", 
      crown: "text-primary",
    },
    2: {
      container: "order-1 h-48 self-end", 
      avatar: "w-20 h-20 border-4 border-slate-400", 
      crown: "text-slate-500",
    },
    3: {
      container: "order-3 h-48 self-end", 
      avatar: "w-20 h-20 border-4 border-amber-500", 
      crown: "text-amber-600",
    },
  };

  const styles = rankStyles[rank];

  return (
    <div className={cn("flex flex-col items-center justify-end w-1/3", styles.container)}>
      <div className="relative">
        <Crown className={cn("w-8 h-8 absolute -top-4 left-1/2 -translate-x-1/2 z-10", styles.crown)} />
        <Avatar className={cn("mb-2 shadow-lg", styles.avatar)}>
          <AvatarImage src={getAvatarUrl(user._id)} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </div>
      <p className="font-bold text-lg text-foreground truncate w-full px-2 text-center">{user.name}</p>
      <div className="mt-1 px-4 py-1 rounded-lg font-bold text-sm bg-primary/20 text-primary-foreground">
        {user.totalPoints.toLocaleString()} 🔥
      </div>
    </div>
  );
}