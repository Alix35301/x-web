"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BankAccount {
  id: number;
  bank_name: string;
  account_name: string;
  account_type: string;
}

interface ImportReport {
  success: boolean;
  importedCount: number;
  duplicateCount: number;
  totalRows: number;
  warnings: string[];
  errors?: string[];
}

export default function StatementImportPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const response = await fetch("/api/bank-import/accounts");
    const data = await response.json();
    setAccounts(data.filter((acc: BankAccount) => acc));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedAccountId) {
      return;
    }

    setUploading(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("accountId", selectedAccountId);

      const response = await fetch("/api/bank-import/statement", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setReport(data);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setReport({
        success: false,
        importedCount: 0,
        duplicateCount: 0,
        totalRows: 0,
        warnings: [],
        errors: [error.message || "Failed to upload statement"],
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Import Bank Statement</CardTitle>
          <CardDescription>
            Upload a CSV file from your bank to automatically import transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <Label htmlFor="account">Bank Account *</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.bank_name} - {account.account_name || account.account_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {accounts.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No bank accounts configured.{" "}
                  <a href="/bank-import/accounts" className="text-primary underline">
                    Add one first
                  </a>
                  .
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="file-input">CSV File *</Label>
              <div className="mt-2">
                <label
                  htmlFor="file-input"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    file
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <FileText className="w-10 h-10 mb-2 text-primary" />
                        <p className="text-sm text-gray-600">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV files only (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!file || !selectedAccountId || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Statement"}
            </Button>
          </form>

          {report && (
            <div className="mt-6 space-y-4">
              {report.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="font-semibold mb-2">Import Successful!</div>
                    <ul className="space-y-1 text-sm">
                      <li>Total rows: {report.totalRows}</li>
                      <li>Imported: {report.importedCount} new transactions</li>
                      {report.duplicateCount > 0 && (
                        <li>Skipped: {report.duplicateCount} duplicates</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-semibold mb-2">Import Failed</div>
                    {report.errors && report.errors.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {report.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {report.warnings && report.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="font-semibold mb-2">Warnings ({report.warnings.length})</div>
                    <ul className="list-disc list-inside space-y-1 text-sm max-h-40 overflow-y-auto">
                      {report.warnings.slice(0, 10).map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                      {report.warnings.length > 10 && (
                        <li className="font-semibold">
                          ... and {report.warnings.length - 10} more warnings
                        </li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {report.success && (
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <a href="/expenses">View Imported Transactions</a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>Configure your bank account with CSV column mappings</li>
            <li>Download your bank statement as CSV from your bank's website</li>
            <li>Select the bank account and upload the CSV file</li>
            <li>Transactions are automatically imported and categorized</li>
            <li>Duplicates are detected and skipped automatically</li>
            <li>Review and approve imported transactions in the Expenses page</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
