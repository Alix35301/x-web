import {
  FormItem,
  FormControl,
  FormField,
  Form,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "./DatePicker";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import Modal from "./Modal";

const ExpenseForm = ({
  data,
  isOpen,
  onClose,
}: {
  data?: any;
  isOpen?: boolean;
  onClose: () => void;
}) => {
  const [categories, setCategories] = useState<any>([]);

  const expenseFormSchema = z.object({
    amount: z.coerce.number(),
    note: z.string(),
    category_id: z.string(),
    date: z.date(),
  });

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: 0,
      note: "",
      category_id: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    form.setValue("amount", data?.amount);
    form.setValue("note", data?.note);
    form.setValue("category_id", data?.category_id);
    form.setValue("date", data?.date);
    fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    const categories = await fetch("/api/categories");
    const data = await categories.json();
    setCategories(data);
  };

  const handleExpenseSubmit = async () => {
    try {
      const formData = form.getValues();
      const isUpdate = data?.id;

      const url = isUpdate ? `/api/expenses/${data.id}` : "/api/expenses";
      const method = isUpdate ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isUpdate ? 'Failed to update expense' : 'Failed to create expense');
      }

      form.reset();
      onClose();

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Expense submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen || false}
      title={data?.id ? "Update Expense" : "Create Expense"}
      description={data?.id ? "Update an existing expense" : "Create a new expense"}
      onSubmit={form.handleSubmit(handleExpenseSubmit)}
      onClose={onClose}
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Label>Date</Label>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <Label>Amount</Label>
                <FormControl>
                  <Input type="number" placeholder="Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <Label>Note</Label>
                <FormControl>
                  <Input type="text" placeholder="Note" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <Label>Category</Label>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data?.map((category: any, index: any) => (
                        <SelectItem key={index} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
