import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import dayjs from "dayjs";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DailyAggregate,
  WeeklyAggregate,
  MonthlyAggregate,
  FrequencyType,
} from "@/types/dashboard";

interface ChartProps {
  metrics: {
    dailyAggregates?: DailyAggregate[];
    weeklyAggregates?: WeeklyAggregate[];
    monthlyAggregates?: MonthlyAggregate[];
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    backgroundColor: string;
    data: number[];
  }>;
}

const Chart = ({ metrics }: ChartProps) => {
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const frequencies: Array<{ value: FrequencyType; label: string }> = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const getChartColor = () => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-primary")
      .trim();
  };

  useEffect(() => {
    const chartColor = getChartColor();

    if (frequency === "daily") {
      setChartData({
        labels:
          metrics.dailyAggregates?.map((val) =>
            dayjs(val.date).format("DD MMM")
          ) || [],
        datasets: [
          {
            label: "Expense",
            backgroundColor: chartColor,
            data: metrics.dailyAggregates?.map((val) => val.total) || [],
          },
        ],
      });
    } else if (frequency === "weekly") {
      setChartData({
        labels:
          metrics.weeklyAggregates?.map((val) => `Week ${val.week}`) || [],
        datasets: [
          {
            label: "Expense",
            backgroundColor: chartColor,
            data: metrics.weeklyAggregates?.map((val) => val.total) || [],
          },
        ],
      });
    } else if (frequency === "monthly") {
      setChartData({
        labels:
          metrics.monthlyAggregates?.map(
            (val) => `${val.year}-${String(val.month).padStart(2, "0")}`
          ) || [],
        datasets: [
          {
            label: "Expense",
            backgroundColor: chartColor,
            data: metrics.monthlyAggregates?.map((val) => val.total) || [],
          },
        ],
      });
    }
  }, [frequency, metrics]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Expense Breakdown</h2>
            <p className="text-sm text-muted-foreground">
              A visual summary of your spending for time periods
            </p>
          </div>
          <div
            className="flex gap-2"
            role="group"
            aria-label="Chart frequency selector"
          >
            {frequencies.map((freq) => (
              <Button
                key={freq.value}
                variant={frequency === freq.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFrequency(freq.value)}
                aria-pressed={frequency === freq.value}
              >
                {freq.label}
              </Button>
            ))}
          </div>
        </div>
        <BarChart data={chartData} />
      </CardHeader>
    </Card>
  );
};

export default Chart;
