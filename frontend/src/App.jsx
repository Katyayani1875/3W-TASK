// A humanly written comment:
// This is the main App component, the orchestrator of our frontend.
// It handles all state, fetches data from our backend, and manages user
// interactions like adding users or claiming points. Using toasts for
// notifications provides a much better user experience than alerts.

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Leaderboard } from "./components/custom/Leaderboard";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Loader2, UserPlus, Award } from "lucide-react";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const [leaderboardRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/leaderboard`),
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
      const res = await axios.post(`${API_URL}/claim`, { userId: selectedUser });
      toast.success(res.data.message);
      await fetchData(); // Refresh all data
    } catch (err) {
      toast.error("Failed to claim points.");
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
      await fetchData(); // Refresh all data
    } catch (err) {
      toast.error("Failed to add user. Name might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Hourly Ranking
          </h1>
          <p className="text-muted-foreground mt-2">Claim points and climb the leaderboard!</p>
        </header>

        <main>
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>Leaderboard Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select onValueChange={setSelectedUser} value={selectedUser} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="🏆 Select a User to Award" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleClaimPoints} disabled={isLoading || !selectedUser} className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4" />}
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
                />
                <Button type="submit" variant="outline" disabled={isLoading || !newUser.trim()} className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>

          <Leaderboard leaderboardData={leaderboard} />
        </main>
      </div>
    </div>
  );
}

export default App;