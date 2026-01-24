"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface CategoryRule {
  id: number;
  pattern: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  priority: number;
  is_active: boolean;
  match_count: number;
}

interface Category {
  id: number;
  name: string;
}

export default function CategoryRulesPage() {
  const [rules, setRules] = useState<CategoryRule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<CategoryRule | null>(null);
  const [formData, setFormData] = useState({
    pattern: "",
    categoryId: "",
    priority: 0,
    isActive: true,
  });

  const fetchRules = async () => {
    const response = await fetch("/api/bank-import/category-rules");
    const data = await response.json();
    setRules(data);
  };

  const fetchCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchRules();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = selectedRule
      ? `/api/bank-import/category-rules/${selectedRule.id}`
      : "/api/bank-import/category-rules";

    const method = selectedRule ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setOpen(false);
    setSelectedRule(null);
    resetForm();
    fetchRules();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await fetch(`/api/bank-import/category-rules/${id}`, { method: "DELETE" });
      fetchRules();
    }
  };

  const handleEdit = (rule: CategoryRule) => {
    setSelectedRule(rule);
    setFormData({
      pattern: rule.pattern,
      categoryId: rule.category_id.toString(),
      priority: rule.priority,
      isActive: rule.is_active,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      pattern: "",
      categoryId: "",
      priority: 0,
      isActive: true,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedRule(null);
      resetForm();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category Rules</CardTitle>
            <CardDescription className="mt-2">
              Auto-categorize transactions based on merchant name patterns
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedRule ? "Edit Category Rule" : "Add Category Rule"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pattern">Merchant Pattern *</Label>
                  <Input
                    id="pattern"
                    placeholder="e.g., Amazon, Starbucks, Shell"
                    value={formData.pattern}
                    onChange={(e) =>
                      setFormData({ ...formData, pattern: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Case-insensitive substring match. Will match any transaction containing this text.
                  </p>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher priority rules are checked first. Default: 0
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedRule ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No category rules configured. Add rules to automatically categorize imported transactions.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono">{rule.pattern}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                        {rule.category.name}
                      </span>
                    </TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {rule.match_count} times
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rule.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {rule.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">How Category Rules Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>Rules are checked in priority order (highest first)</li>
            <li>The first matching rule wins - only one category is assigned per transaction</li>
            <li>Pattern matching is case-insensitive</li>
            <li>Transactions that don't match any rule are marked as "Uncategorized"</li>
            <li>Match counts help you understand which rules are being used</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Example:</strong> Pattern "Amazon" will match transactions like "AMAZON.COM", "Amazon Prime", "amazon marketplace", etc.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
