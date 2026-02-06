"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import * as React from "react";
import DateRangePicker from "../../components/DateRangePicker";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";
import ExpenseForm from "../../components/ExpenseForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Trash2 } from "lucide-react";

const expensePage = () => {
  const [expenses, setExpenses] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [page, setPage] = React.useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    const params = new URLSearchParams();
    params.set("limit", "10");
    params.set("page", String(page));

    if (search) {
      params.set("search", search);
    }
    if (dateRange?.from && dateRange?.to) {
      params.set("start_date", dayjs(dateRange.from).format("YYYY-MM-DD"));
      params.set("end_date", dayjs(dateRange.to).format("YYYY-MM-DD"));
    }

    const response = await fetch(`/api/expenses?${params.toString()}`);
    const data = await response.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
    setSelectedIds(new Set());
  }, [page, search, dateRange]);

  const openEditForm = (data: any) => {
    setSelectedItem(data);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await fetch(`/api/expenses/${itemToDelete}`, { method: "DELETE" });
      setItemToDelete(null);
      await fetchExpenses();
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (!expenses?.data) return;
    const allIds = expenses.data.map((e: any) => e.id);
    const allSelected = allIds.every((id: number) => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    setSelectedIds(new Set());
    await fetchExpenses();
  };

  return (
    <div className="p-6">
      <div className="text-2xl font-bold mb-4">Your Expenses</div>

      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Input
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search expenses..."
            className="w-full"
          />
          <div className="flex gap-2">
            <Button variant="default" onClick={() => setOpen(true)}>
              Create
            </Button>
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                onClick={() => setBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedIds.size})
              </Button>
            )}
            <ExpenseForm
              data={selectedItem}
              isOpen={open}
              onClose={() => setOpen(false)}
            />
          </div>
          <DateRangePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setPage(1);
            }}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  expenses?.data?.length > 0 &&
                  expenses.data.every((e: any) => selectedIds.has(e.id))
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.data?.length > 0 ? (
            expenses.data.map((data: any, index: any) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(data.id)}
                    onCheckedChange={() => toggleSelect(data.id)}
                  />
                </TableCell>
                <TableCell>{dayjs(data.date).format("DD MMM YYYY")}</TableCell>
                <TableCell>{data.description}</TableCell>
                <TableCell>RF {data.amount}</TableCell>
                <TableCell className="flex gap-4 flex-end">
                  <Button onClick={() => openEditForm(data)} variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(data.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {expenses?.data?.length > 0 && (
        <div className="flex justify-center mt-4 items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(page - 1)} />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext onClick={() => setPage(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ConfirmationModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
      />

      <ConfirmationModal
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Transactions"
        description={`Are you sure you want to delete ${selectedIds.size} transaction${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
      />
    </div>
  );
};

export default expensePage;
