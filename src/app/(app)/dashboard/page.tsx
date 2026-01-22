"use client";

import { useState, useEffect } from "react";
import MetricCard from "../../components/MetricCard";
import Chart from "../../components/Chart";
import Link from "next/link";
import TransactionCard from "../../components/TransactionCard";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Expense,
  DashboardMetrics,
  PaginatedResponse,
  DailyAggregate,
  WeeklyAggregate,
  MonthlyAggregate,
} from "@/types/dashboard";
import {
  MetricCardSkeleton,
  ChartSkeleton,
  TransactionCardSkeleton,
} from "../../components/DashboardSkeleton";
import { ErrorAlert } from "../../components/ErrorAlert";

interface MetricsResponse {
  daily: DashboardMetrics["daily"] & { trend: "increase" | "decrease" };
  weekly: DashboardMetrics["weekly"] & { trend: "increase" | "decrease" };
  monthly: DashboardMetrics["monthly"] & { trend: "increase" | "decrease" };
  dailyAggregates?: DailyAggregate[];
  weeklyAggregates?: WeeklyAggregate[];
  monthlyAggregates?: MonthlyAggregate[];
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchExpenses = async () => {
    try {
      setExpensesLoading(true);
      setExpensesError(null);
      const response = await fetch("/api/expenses?limit=5&page=1");
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data: PaginatedResponse<Expense> = await response.json();
      setExpenses(data.data || []);
    } catch (error) {
      setExpensesError(
        error instanceof Error ? error.message : "Failed to load expenses"
      );
    } finally {
      setExpensesLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);
      const response = await fetch("/api/expenses/metrics");
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const result = await response.json();
      setMetrics(result.data);
    } catch (error) {
      setMetricsError(
        error instanceof Error ? error.message : "Failed to load metrics"
      );
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="pb-12 flex w-full flex-col p-6">
      <header className="mt-14 mb-8">
        <h1 className="text-2xl md:text-3xl">
          {getWelcomeMessage()},{" "}
          <span className="font-semibold">
            {user?.name || user?.email || "User"}
          </span>
        </h1>
      </header>

      <div className="flex flex-col gap-8 w-full">
        <section aria-label="Expense metrics">
          {metricsError ? (
            <ErrorAlert message={metricsError} onRetry={fetchMetrics} />
          ) : metricsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                title="Daily"
                value={metrics?.daily?.today ?? 0}
                trend={metrics?.daily?.trend ?? "decrease"}
              />
              <MetricCard
                title="Weekly"
                value={metrics?.weekly?.thisWeek ?? 0}
                trend={metrics?.weekly?.trend ?? "decrease"}
              />
              <MetricCard
                title="Monthly"
                value={metrics?.monthly?.thisMonth ?? 0}
                trend={metrics?.monthly?.trend ?? "decrease"}
              />
            </div>
          )}
        </section>

        <section aria-label="Expense breakdown chart">
          {metricsError ? (
            <ErrorAlert message={metricsError} onRetry={fetchMetrics} />
          ) : metricsLoading ? (
            <ChartSkeleton />
          ) : (
            <Chart metrics={metrics || {}} />
          )}
        </section>

        <section aria-label="Recent transactions" className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p className="text-sm text-muted-foreground">
              Your recent transactions
            </p>
          </div>

          {expensesError ? (
            <ErrorAlert message={expensesError} onRetry={fetchExpenses} />
          ) : expensesLoading ? (
            <>
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
              <TransactionCardSkeleton />
            </>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <>
              {expenses.map((expense) => (
                <TransactionCard key={expense.id} expense={expense} />
              ))}
              <div className="flex justify-end">
                <Button variant="ghost" asChild>
                  <Link href="/expenses" className="flex items-center gap-2">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
