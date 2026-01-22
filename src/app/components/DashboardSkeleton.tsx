import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <Card className="w-full h-30">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="size-6 md:size-12 shrink-0 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </CardHeader>
    </Card>
  );
}

export function TransactionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full relative">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="flex flex-col ms-10 gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
