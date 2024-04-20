import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useRef, useState, MutableRefObject } from "react";
import { STATISTIC_VARIABLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Add } from "../../wailsjs/go/main/App";
import { pb } from "../../wailsjs/go/models";
import BCRequest = pb.BCRequest;

type DataInputType = {
  row: string;
  values: MutableRefObject<any>[]; // refs
};

let removedVariables: string[] = [];

export const DataInput = () => {
  const [rows, setRows] = useState<string[]>(["X"]);
  const [columns, setColumns] = useState<number>(1);
  const [noColumns, setNoColumns] = useState<number>(1);
  const [data, setData] = useState<DataInputType[]>([]);
  const cellRefs = useRef<any>({});
  const memoizedData = useMemo(() => data, [data]);

  const addRow = () => {
    let variable = removedVariables.length
      ? removedVariables.pop()
      : STATISTIC_VARIABLES.shift();
    if (!variable) return;

    setRows([...rows, variable]);
    setColumns(columns + 1);
  };

  const removeRow = () => {
    if (rows.length === 1) return;

    let variable = rows.pop();
    if (!variable) return;

    removedVariables.push(variable);
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

  const handleInputData = (column: number, i: number) => {
    const existingRowIndex = memoizedData.findIndex(
      (row) => row.row === rows[column],
    );
    const existingRow =
      existingRowIndex !== -1 ? memoizedData[existingRowIndex] : undefined;
    let newData = [] as DataInputType[];
    let currentRef = cellRefs.current[`${rows[column]}-${i}`];
    if (existingRow) {
      newData = memoizedData.map((row) => {
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
        ...memoizedData,
        {
          row: rows[column],
          values: [currentRef],
        },
      ];
    }

    setData(newData);
  };

  const getData = async () => {
    console.time("perf");
    // handle DataInputType[] to pb.Request
    let pbRequestData = {
      data: data.map((item) => {
        return {
          row: item.row,
          values: item.values.map((ref: any) => Number(ref.value)),
        };
      }),
    } as BCRequest;

    await Add(pbRequestData).then((res) => {
      console.info(res);
    });
    console.timeEnd("perf");
    console.log("asdsadasdsadwqeqweqwe");
  };

  return (
    <>
      <ScrollArea>
        <Table>
          <TableCaption className="mb-12">
            <div className="flex flex-col items-center">
              <Button variant={"secondary"} className="w-24" onClick={getData}>
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
    </>
  );
};
