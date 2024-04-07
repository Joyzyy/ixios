import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { STATISTIC_VARIABLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type DataInputType = {
  row: string;
  values: number[];
};

export const DataInput = () => {
  const [rows, setRows] = useState<string[]>(["X"]);
  const [columns, setColumns] = useState<number>(1);
  const [noColumns, setNoColumns] = useState<number>(1);
  const [data, setData] = useState<DataInputType[]>([]);

  const memoizedData = useMemo(() => data, [data]);

  const addRow = () => {
    let variable = STATISTIC_VARIABLES.shift();
    if (!variable) return;

    setRows([...rows, variable]);
    setColumns(columns + 1);
  };

  const removeRow = () => {
    if (rows.length === 1) return;
    let variable = rows.pop();
    if (!variable) return;

    STATISTIC_VARIABLES.unshift();
    setRows([...rows]);
    setColumns(columns - 1);
    const newData = memoizedData.filter((row) => row.row !== variable);
    setData(newData);
  };

  const removeColumn = () => {
    if (noColumns === 1) return;
    setNoColumns(noColumns - 1);
    const newData = memoizedData.map((row) => {
      return {
        ...row,
        values: row.values.slice(0, -1),
      };
    });

    setData(newData);
  };

  return (
    <>
      <ScrollArea>
        <Table>
          <TableCaption className="mb-12">
            <div className="flex flex-col items-center">
              <Button variant={"secondary"} className="w-24">
                Send
              </Button>
              <p>Place your data input here</p>
            </div>
          </TableCaption>
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
            {Array.from(Array(noColumns).keys()).map((column) => (
              <TableRow key={column} className="flex flex-row">
                {Array.from(Array(columns).keys()).map((column) => (
                  <TableCell key={column}>
                    <Input
                      type="text"
                      className="w-20 text-center"
                      onChange={(event) => {
                        const newValue = event.currentTarget.value;
                        const existingRow = memoizedData.find(
                          (row) => row.row === rows[column]
                        );

                        let newData;
                        if (existingRow) {
                          newData = memoizedData.map((row) => {
                            if (row.row === rows[column]) {
                              return {
                                ...row,
                                values: [...row.values, Number(newValue)],
                              };
                            }
                            return row;
                          });
                        } else {
                          newData = [
                            ...memoizedData,
                            {
                              row: rows[column],
                              values: [Number(newValue)],
                            },
                          ];
                        }

                        setData(newData);
                      }}
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
    </>
  );
};
