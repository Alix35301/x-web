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
import * as React from "react";
import DatePicker from "../../components/DatePicker";
import dayjs from "dayjs";
import ExpenseForm from "../../components/ExpenseForm";

const expensePage = () => {
  const [expenses, setExpenses] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [page, setPage] = React.useState(1);
  const [selectedItem, setSelectedItem] = useState();

  const fetchExpenses = async () => {
    const expenses = await fetch("/api/expenses?limit=10&page=" + page);
    const data = await expenses.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [page]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await fetch(
        "/api/expenses?search=" + search + "&limit=10&page=1"
      );
      const data = await expenses.json();
      setExpenses(data);
    };
    if (search) {
      fetchExpenses();
    }
  }, [search]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await fetch(
        "/api/expenses?start_date=" +
          dayjs(startDate).format("YYYY-MM-DD") +
          "&end_date=" +
          dayjs(endDate).format("YYYY-MM-DD") +
          "&limit=10&page=1"
      );
      const data = await expenses.json();
      setExpenses(data);
    };
    fetchExpenses();
  }, [startDate, endDate]);

  const openEditForm = (data: any) => {
    setSelectedItem(data);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    await fetchExpenses();
  };

  return (
    <div className="mt-30 p-6 ">
      <div className="text-2xl font-bold mb-4">Your Expenses</div>

      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full"
          />
          <div>
            <Button variant="default" onClick={() => setOpen(true)}>
              Create
            </Button>
            <ExpenseForm
              data={selectedItem}
              isOpen={open}
              onClose={() => setOpen(false)}
            />
          </div>
          <div className="flex gap-4">
            <DatePicker onChange={setStartDate} value={startDate} />
            <DatePicker onChange={setEndDate} value={endDate} />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.data?.map((data: any, index: any) => (
            <TableRow key={index}>
              <TableCell>{data.date}</TableCell>
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
          ))}
        </TableBody>
      </Table>

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
    </div>
  );
};

export default expensePage;
