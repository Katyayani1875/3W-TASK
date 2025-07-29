import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Leaderboard } from "./components/custom/Leaderboard";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Loader2, UserPlus, Award, History } from "lucide-react";
import { HistoryModal } from "./components/custom/HistoryModal";
import { cn } from "@/lib/utils";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaimedUser, setLastClaimedUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const [leaderboardRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/users/leaderboard`),
        axios.get(`${API_URL}/users`),
      ]);
      setLeaderboard(leaderboardRes.data.data.leaderboard);
      setUsers(usersRes.data.data.users);
    } catch (err) {
      toast.error("Failed to fetch data. Please refresh.");
      console.error(err);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
  }, [fetchData]);

  const handleClaimPoints = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first!");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/claim`, { userId: selectedUser });
      const claimedUser = users.find(user => user._id === selectedUser);
      setLastClaimedUser({
        name: claimedUser.name,
        points: res.data.data.pointsClaimed
      });
      toast.success(res.data.message);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to claim points.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.trim()) return;
    
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/users`, { name: newUser });
      toast.success(`User "${newUser}" added successfully!`);
      setNewUser("");
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user. Name might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-background text-foreground p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-600" style={{color: "hsl(var(--accent))"}}>
            Hourly Ranking
          </h1>
          <p className="text-muted-foreground mt-2">Claim points and climb the leaderboard!</p>
          
          {lastClaimedUser && (
            <div className="mt-4 animate-pulse">
              <p className="text-sm text-primary">
                Last claim: {lastClaimedUser.name} got +{lastClaimedUser.points} points!
              </p>
            </div>
          )}
        </header>

        <main>
          <Card className="mb-6 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leaderboard Controls</CardTitle>
              <HistoryModal>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                  <History className="h-5 w-5" />
                  <span className="sr-only">View Claim History</span>
                </Button>
              </HistoryModal>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select 
                  onValueChange={setSelectedUser} 
                  value={selectedUser} 
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="🏆 Select a User to Award" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleClaimPoints} 
                  disabled={isLoading || !selectedUser} 
                  className={cn(
                    "w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Award className="mr-2 h-4 w-4" />
                  )}
                  Claim Points
                </Button>
              </div>
              
              <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Enter new user name..."
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  disabled={isLoading}
                  minLength={2}
                  maxLength={30}
                />
                <Button 
                  type="submit" 
                  variant="secondary" 
                  disabled={isLoading || !newUser.trim()} 
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>

          <Leaderboard 
            leaderboardData={leaderboard} 
            isLoading={isLoading}
            highlightedUserId={selectedUser}
          />
        </main>
      </div>
    </div>
  );
}

export default App;