import dayjs from "dayjs";
import { Card, CardHeader } from "@/components/ui/card";
import { Expense } from "@/types/dashboard";

interface TransactionCardProps {
  expense: Expense;
}

const TransactionCard = ({ expense }: TransactionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full gap-4">
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="text-foreground text-xl md:text-2xl font-semibold leading-tight">
              {dayjs(expense.date).format("DD")}
            </div>
            <div className="text-muted-foreground text-sm md:text-base">
              {dayjs(expense.date).format("MMM")}
            </div>
          </div>

          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="text-foreground text-base md:text-lg font-bold">
              RF {Intl.NumberFormat("en-US").format(expense.amount)}
            </div>
            <div className="text-muted-foreground text-sm mt-1 truncate">
              {expense.description}
            </div>
            {expense.notes && (
              <div className="text-muted-foreground text-xs mt-1 line-clamp-1">
                {expense.notes}
              </div>
            )}
            {expense.category && (
              <div className="mt-2 w-fit text-foreground text-xs px-3 py-1 bg-primary/20 rounded-md">
                {expense.category}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TransactionCard;
