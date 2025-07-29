import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronsLeft, ChevronsRight, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function HistoryModal({ children }) {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHistory = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history?page=${page}&limit=8`);
      setLogs(res.data.data.logs);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Failed to fetch history", error);
      toast.error("Could not fetch history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${API_URL}/history`);
      toast.success(res.data.message);
      setLogs([]);
      setPagination({});
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to clear history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory(currentPage);
    }
  }, [currentPage, fetchHistory, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Claim History</DialogTitle>
          <DialogDescription>
            A log of the most recent points claimed by users.
          </DialogDescription>
        </DialogHeader>
        <div className="relative min-h-[420px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Points Claimed</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="font-medium">{log.userId?.name || 'Unknown User'}</TableCell>
                    <TableCell className="text-green-500 font-semibold">+{log.pointsClaimed}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center h-24">
                      No history found.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isLoading || logs.length === 0} className="order-last sm:order-first">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all claim history records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Yes, clear history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* Pagination Controls */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage || 0} of {pagination.totalPages || 0}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={!pagination.currentPage || pagination.currentPage === 1 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!pagination.totalPages || pagination.currentPage === pagination.totalPages || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}