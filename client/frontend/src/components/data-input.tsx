import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useRef } from "react";
import { NUMBER_PREDETERMINED, STATISTIC_VARIABLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { DataInputType } from "@/features/models";
import { dataInputAtoms } from "@/features/atoms";
import { useAtom } from "jotai";

let removedVariables: string[] = [];
const NEW_STATISTIC_VARIABLES = STATISTIC_VARIABLES.slice(
  NUMBER_PREDETERMINED,
  STATISTIC_VARIABLES.length
);

export const DataInput = () => {
  const [rows, setRows] = useAtom(dataInputAtoms.rows);
  const [columns, setColumns] = useAtom(dataInputAtoms.columns);
  const [noColumns, setNoColumns] = useAtom(dataInputAtoms.noColumns);
  const [dataInput, setDataInput] = useAtom(dataInputAtoms.data);
  const cellRefs = useRef<any>({});
  const memoizedDataInput = useMemo(() => dataInput, [dataInput]);

  const addRow = () => {
    let variable = removedVariables.length
      ? removedVariables.pop()
      : NEW_STATISTIC_VARIABLES.shift();
    if (!variable) return;

    setRows([...rows, variable]);
    setColumns(columns + 1);
  };

  const removeRow = () => {
    if (rows.length === 1) return;

    let variable = rows.pop();
    if (!variable) return;

    removedVariables.push(variable);
    NEW_STATISTIC_VARIABLES.unshift();
    setRows([...rows]);
    setColumns(columns - 1);

    const newData = memoizedDataInput.filter((row) => row.row !== variable);
    setDataInput(newData);
  };

  const removeColumn = () => {
    if (noColumns === 1) return;
    setNoColumns(noColumns - 1);
    const newData = memoizedDataInput.map((row) => {
      return {
        ...row,
        values: row.values.slice(0, -1),
      };
    });
    setDataInput(newData);
  };

  const handleInputData = (column: number, i: number) => {
    const existingRowIndex = memoizedDataInput.findIndex(
      (row) => row.row === rows[column]
    );
    const existingRow =
      existingRowIndex !== -1 ? memoizedDataInput[existingRowIndex] : undefined;
    let newData = [] as DataInputType[];
    let currentRef = cellRefs.current[`${rows[column]}-${i}`];

    if (existingRow) {
      newData = memoizedDataInput.map((row) => {
        if (row.row === rows[column]) {
          if (row.values.find((c) => c === currentRef)) return row;
          return {
            row: row.row,
            values: [...row.values, currentRef],
          };
        }
        return row;
      });
    } else {
      newData = [
        ...memoizedDataInput,
        {
          row: rows[column],
          values: [currentRef],
        },
      ];
    }

    setDataInput(newData);
  };

  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow className="flex flex-row">
            {rows.map((row) => (
              <TableRow key={row}>
                <Button variant={"link"} disabled className="w-24">
                  {row}
                </Button>
              </TableRow>
            ))}
            <Button variant={"link"} onClick={addRow} className="w-24">
              +
            </Button>
            <Button variant={"link"} onClick={removeRow} className="w-24">
              -
            </Button>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(noColumns).keys()).map((_column, idx) => (
            <TableRow key={_column} className="flex flex-row">
              {Array.from(Array(columns).keys()).map((column) => (
                <TableCell key={column}>
                  <Input
                    type="number"
                    className="w-20 text-center"
                    id={`cell-${rows[column]}-${idx}`}
                    ref={(el) =>
                      (cellRefs.current[`${rows[column]}-${idx}`] = el)
                    }
                    onInput={() => handleInputData(column, idx)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Button
                variant={"link"}
                onClick={() => setNoColumns(noColumns + 1)}
                className="w-12 text-center"
              >
                +
              </Button>
              <Button
                variant={"link"}
                onClick={removeColumn}
                className="w-12 text-center"
              >
                -
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
