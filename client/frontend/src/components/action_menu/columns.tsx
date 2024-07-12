import { ColumnDef } from "@tanstack/react-table";
import { DataInputType } from "@/features/models";
import { Checkbox } from "../ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Line, CartesianGrid, LineChart, XAxis, YAxis } from "recharts";

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconBxLineChart() {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em">
      <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64v336c0 44.2 35.8 80 80 80h400c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l89.4-89.3 57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" />
    </svg>
  );
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

function GenerateGraphDialog({ row }: { row: DataInputType }) {
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconBxLineChart />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated line graph for {row.row}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-h-[500px]"
          >
            <LineChart accessibilityLayer data={row.values}>
              <CartesianGrid vertical={false} />
              <Line
                dataKey={(value: any) => value}
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <XAxis dataKey={(value: any) => value.toString().slice(0, 4)} />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
            </LineChart>
          </ChartContainer>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export const columns: ColumnDef<DataInputType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select this row"
      />
    ),
  },
  {
    accessorKey: "row",
    header: "VARIABLE",
  },
  {
    accessorKey: "values",
    header: "VALUES",
    cell: ({ row }) => (
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            View {row.original.row}'s values
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 rounded-lg" side={"right"}>
          <div className="flex flex-row justify-center items-center mb-2">
            <div className="flex flex-row justify-between w-full">
              <h3 className="text-lg font-medium">
                {row.original.row}'s values
              </h3>
              <GenerateGraphDialog row={row.original} />
            </div>
          </div>
          <hr />
          <div className="mt-2">
            <ScrollArea className="h-48" type="always">
              <ScrollBar orientation="vertical" />
              {row.original.values.map((value, index) => (
                <div key={index}>
                  <span className="font-medium text-sm">{value as any}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
];
