import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const getAvatarUrl = (userId) => {
  return `https://i.pravatar.cc/150?u=${userId}`;
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export function LeaderboardListItem({ user, rank, highlight = false }) {
  const avatarUrl = getAvatarUrl(user._id);

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <motion.li
      className={cn(
        "flex items-center bg-card p-3 rounded-lg shadow-sm hover:bg-muted border-2 transition-all duration-300",
        highlight ? "border-primary ring-2 ring-primary/50" : "border-transparent"
      )}
      variants={itemVariants}
      whileHover="hover"
      layout
    >
      <span className="font-bold text-lg w-10 text-muted-foreground">{rank}</span>
      
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage src={avatarUrl} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="flex-grow min-w-0">
        <p className="font-semibold text-card-foreground truncate">{user.name}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-xs text-muted-foreground cursor-pointer">
              ID: ...{user._id.slice(-6)}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>Full ID: {user._id}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="font-bold text-lg text-primary">
        {/* //added sticker using random emoji */}
        {user.totalPoints.toLocaleString()} 🔥
      </div>
    </motion.li>
  );
}