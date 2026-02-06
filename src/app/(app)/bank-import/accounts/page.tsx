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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface AccountType {
  value: string;
  label: string;
}

interface BankAccount {
  id: number;
  bank_name: string;
  account_name: string;
  account_type: string;
  account_number_last4: string;
  is_active: boolean;
  csv_config: any;
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountType: "SAVING",
    accountNumberLast4: "",
    csvConfig: {
      delimiter: ",",
      skipRows: 1,
      columnMappings: {
        date: 0,
        description: 1,
        amount: 2,
        type: undefined as number | undefined,
      },
      dateFormat: "YYYY-MM-DD",
    },
  });
  const [filterInclude, setFilterInclude] = useState("");
  const [filterExclude, setFilterExclude] = useState("");

  const fetchAccounts = async () => {
    const response = await fetch("/api/bank-import/accounts");
    const data = await response.json();
    setAccounts(data);
  };

  const fetchAccountTypes = async () => {
    const response = await fetch("/api/bank-import/config/account-types");
    const data = await response.json();
    setAccountTypes(data);
  };

  useEffect(() => {
    fetchAccounts();
    fetchAccountTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = selectedAccount
      ? `/api/bank-import/accounts/${selectedAccount.id}`
      : "/api/bank-import/accounts";

    const method = selectedAccount ? "PATCH" : "POST";

    // Build filters object from comma-separated inputs
    const filters: Record<string, { include?: string[]; exclude?: string[] }> = {};
    const includeValues = filterInclude.split(",").map(s => s.trim()).filter(Boolean);
    const excludeValues = filterExclude.split(",").map(s => s.trim()).filter(Boolean);

    if (includeValues.length > 0 || excludeValues.length > 0) {
      filters.type = {};
      if (includeValues.length > 0) filters.type.include = includeValues;
      if (excludeValues.length > 0) filters.type.exclude = excludeValues;
    }

    const payload = {
      ...formData,
      csvConfig: {
        ...formData.csvConfig,
        ...(Object.keys(filters).length > 0 && { filters }),
      },
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setOpen(false);
    setSelectedAccount(null);
    resetForm();
    fetchAccounts();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await fetch(`/api/bank-import/accounts/${id}`, { method: "DELETE" });
      fetchAccounts();
    }
  };

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormData({
      bankName: account.bank_name,
      accountName: account.account_name,
      accountType: account.account_type,
      accountNumberLast4: account.account_number_last4 || "",
      csvConfig: account.csv_config,
    });
    // Load existing filters
    const typeFilter = account.csv_config?.filters?.type;
    setFilterInclude(typeFilter?.include?.join(", ") || "");
    setFilterExclude(typeFilter?.exclude?.join(", ") || "");
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      bankName: "",
      accountName: "",
      accountType: "SAVING",
      accountNumberLast4: "",
      csvConfig: {
        delimiter: ",",
        skipRows: 1,
        columnMappings: {
          date: 0,
          description: 1,
          amount: 2,
          type: undefined,
        },
        dateFormat: "YYYY-MM-DD",
      },
    });
    setFilterInclude("");
    setFilterExclude("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedAccount(null);
      resetForm();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bank Accounts</CardTitle>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0">
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle>
                  {selectedAccount ? "Edit Bank Account" : "Add Bank Account"}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] px-6">
              <form onSubmit={handleSubmit} className="space-y-6 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g., Personal Checking"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, accountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumberLast4">Last 4 Digits</Label>
                  <Input
                    id="accountNumberLast4"
                    maxLength={4}
                    placeholder="1234"
                    value={formData.accountNumberLast4}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumberLast4: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-6">CSV Configuration</h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="delimiter">Delimiter</Label>
                      <Select
                        value={formData.csvConfig.delimiter}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            csvConfig: {
                              ...formData.csvConfig,
                              delimiter: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=",">Comma (,)</SelectItem>
                          <SelectItem value=";">Semicolon (;)</SelectItem>
                          <SelectItem value="\t">Tab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skipRows">Skip Rows (header)</Label>
                      <Input
                        id="skipRows"
                        type="number"
                        min="0"
                        value={formData.csvConfig.skipRows}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            csvConfig: {
                              ...formData.csvConfig,
                              skipRows: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateCol">Date Column (0-indexed)</Label>
                        <Input
                          id="dateCol"
                          type="number"
                          min="0"
                          value={formData.csvConfig.columnMappings.date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              csvConfig: {
                                ...formData.csvConfig,
                                columnMappings: {
                                  ...formData.csvConfig.columnMappings,
                                  date: parseInt(e.target.value),
                                },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descCol">Description Column</Label>
                        <Input
                          id="descCol"
                          type="number"
                          min="0"
                          value={formData.csvConfig.columnMappings.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              csvConfig: {
                                ...formData.csvConfig,
                                columnMappings: {
                                  ...formData.csvConfig.columnMappings,
                                  description: parseInt(e.target.value),
                                },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amountCol">Amount Column</Label>
                        <Input
                          id="amountCol"
                          type="number"
                          min="0"
                          value={formData.csvConfig.columnMappings.amount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              csvConfig: {
                                ...formData.csvConfig,
                                columnMappings: {
                                  ...formData.csvConfig.columnMappings,
                                  amount: parseInt(e.target.value),
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={formData.csvConfig.dateFormat}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            csvConfig: {
                              ...formData.csvConfig,
                              dateFormat: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                          <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                          <SelectItem value="DD-MM-YYYY HH-mm-ss">DD-MM-YYYY HH-mm-ss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="typeCol">Type Column (optional, for filtering)</Label>
                      <Input
                        id="typeCol"
                        type="number"
                        min="0"
                        placeholder="e.g., 3"
                        value={formData.csvConfig.columnMappings.type ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            csvConfig: {
                              ...formData.csvConfig,
                              columnMappings: {
                                ...formData.csvConfig.columnMappings,
                                type: e.target.value ? parseInt(e.target.value) : undefined,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterInclude">Include Types (comma-separated)</Label>
                        <Input
                          id="filterInclude"
                          placeholder="e.g., CR, CREDIT"
                          value={filterInclude}
                          onChange={(e) => setFilterInclude(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterExclude">Exclude Types (comma-separated)</Label>
                        <Input
                          id="filterExclude"
                          placeholder="e.g., DR, DEBIT"
                          value={filterExclude}
                          onChange={(e) => setFilterExclude(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedAccount ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last 4</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No bank accounts configured. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.bank_name}</TableCell>
                    <TableCell>{account.account_name || "-"}</TableCell>
                    <TableCell>{account.account_type}</TableCell>
                    <TableCell>{account.account_number_last4 || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {account.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(account)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(account.id)}
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
    </div>
  );
}
