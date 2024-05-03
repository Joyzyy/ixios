import { ColumnDef } from "@tanstack/react-table";
import { DataInputType } from "@/features/models";
import { Checkbox } from "../ui/checkbox";

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
    header: "Variable",
  },
  {
    accessorKey: "values",
    header: "Values",
  },
];
