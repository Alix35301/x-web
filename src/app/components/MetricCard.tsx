import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  trend: "increase" | "decrease";
}

const MetricCard = ({ title, value, trend }: MetricCardProps) => {
  const isIncrease = trend === "increase";

  return (
    <Card className="w-full h-30">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="text-muted-foreground text-sm mb-2">{title}</div>
            <div
              className="text-foreground text-xl md:text-2xl font-bold whitespace-nowrap"
              aria-label={`${title}: ${value} Rwandan Francs`}
            >
              RF {Intl.NumberFormat("en-US").format(value ?? 0)}
            </div>
          </div>
          <div
            className={cn(
              "size-6 md:size-12 shrink-0 flex justify-center items-center rounded-full",
              isIncrease ? "bg-destructive" : "bg-primary"
            )}
            aria-label={isIncrease ? "Increased" : "Decreased"}
          >
            {isIncrease ? (
              <TrendingUp className="size-3 md:size-8 text-white" />
            ) : (
              <TrendingDown className="size-3 md:size-8 text-white" />
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MetricCard;
