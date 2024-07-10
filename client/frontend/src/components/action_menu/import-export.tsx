import { dataInputAtoms, importExportDialogAtom } from "@/features/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import xlsx from "xlsx";
import { Select } from "../ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const ImportExportDialogWrapper = () => {
  const importExportDialog = useAtomValue(importExportDialogAtom);
  if (!importExportDialog) return null;
  return <ImportExportDialog />;
};

const transposeValues = (data: any) => {
  // Find the longest array of values to determine the number of rows needed
  const maxLength = Math.max(...data.map((entry: any) => entry.values.length));

  // Create an array of arrays, where each sub-array represents a row in the transposed matrix
  const transposed: any = Array.from({ length: maxLength }, () => []);

  // Fill the transposed matrix with values, or null where some rows are shorter than others
  data.forEach((entry: any) => {
    entry.values.forEach((value: any, index: any) => {
      transposed[index].push(value);
    });
    // If the current entry's values array is shorter than maxLength, fill the rest with null
    for (let i = entry.values.length; i < maxLength; i++) {
      transposed[i].push(null);
    }
  });

  return transposed;
};

const ImportExportDialog: React.FC = () => {
  const [importExportDialog, setImportExportDialog] = useAtom(
    importExportDialogAtom
  );
  const [file, setFile] = useState<File>();
  const [step, setStep] = useState<number>(0);
  const [workbook, setWorkbook] = useState<xlsx.WorkBook>();
  const [data, setData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const setDataInput = useSetAtom(dataInputAtoms.data);
  const setRows = useSetAtom(dataInputAtoms.rows);
  const setColumns = useSetAtom(dataInputAtoms.columns);
  const setNoColumns = useSetAtom(dataInputAtoms.noColumns);
  const { toast } = useToast();

  useEffect(() => {
    const handle = async () => {
      if (file) {
        setDataInput([]);
        const data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { dense: true });
        setWorkbook(workbook);
      }
    };
    handle();
  }, [file]);

  const reset = () => {
    setFile(undefined);
    setWorkbook(undefined);
    setImportExportDialog(null);
    setData([]);
    setSelectedRows("");
    setSubmit(false);
    setStep(0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    setFile(file);
  };

  const previewSelectedData = () => {
    const sheet = workbook?.Sheets[workbook?.SheetNames[0]];
    let data_values: any = [];
    if (sheet) {
      const data = xlsx.utils.sheet_to_json(sheet);
      if (selectedRows) {
        const [start, end] = selectedRows.split(":");
        const startRow = parseInt(start.replace(/\D/g, ""));
        const endRow = parseInt(end.replace(/\D/g, ""));
        setData(data.slice(startRow - 1, endRow));
      } else {
        // so if there is a data with the same column like: 1, 1, 1: it transforms it like this
        // 1, 1_1, 1_2, i need to fix this so that its 1: [val_1, val_2, val_3
        data.map((d: any, i) => {
          let m: any = {};
          Object.keys(d).map((key) => {
            if (!/^-?\d*[,.]?\d*$/.test(d[key])) {
              toast({
                title: "Invalid input",
                description:
                  "The input contains a non-numeric value. Transforming it to 0.",
                variant: "destructive",
              });
              d[key] = 0;
            }
            if (key.includes("_")) {
              let v = key.split("_")[0];
              if (v in m) {
                if (Array.isArray(m[v])) {
                  m[v].push(d[key]);
                } else {
                  m[v] = [m[v], d[key]];
                }
              }
            } else {
              m[key] = d[key];
            }
          });
          data_values.push(m);
        });
      }

      if (data_values) {
        const res: {
          row: string;
          values: number[];
        }[] = data_values.reduce((acc: any, item: any) => {
          Object.entries(item).forEach(([key, value]) => {
            const existingItem = acc.find((x: any) => x.row === key);
            if (existingItem) {
              if (Array.isArray(value)) {
                existingItem.values.push(...value); // Spread to push all elements if it's an array
              } else {
                existingItem.values.push(value);
              }
            } else {
              if (Array.isArray(value)) {
                acc.push({ row: key, values: [...value] }); // Spread to copy all elements if it's an array
              } else {
                acc.push({ row: key, values: [value] }); // Wrap in an array if it's a single number
              }
            }
          });
          return acc;
        }, []);

        setData(res);

        let max = 0;
        res.forEach((r) => {
          if (r.values.length > max) max = r.values.length;
        });

        if (sheet["!data"] && !selectedRows) {
          setNoColumns(max);

          setRows(
            [...new Set(sheet["!data"]?.[0].map((d: any) => d.v) as any)].map(
              (r: any) => r.toString()
            )
          );
          max = 0;
          data_values.forEach((d: any) => {
            if (Object.keys(d).length > max) max = Object.keys(d).length;
          });
          setColumns(max);

          setSubmit(true);
        }

        if (submit) {
          let indices: any = {};
          Array.from(
            document.querySelectorAll<HTMLInputElement>(
              "input[type=number][id^=cell-]"
            )
          )
            .sort((a, b) =>
              a.id.split("-")[1].localeCompare(b.id.split("-")[1])
            )
            .forEach((e) => {
              const row = e.id.split("-")[1];
              if (!indices[row]) indices[row] = 0;
              const r = res.find((r) => r.row === row);
              if (r) {
                if (r.values[indices[row]] !== undefined)
                  e.valueAsNumber = r.values[indices[row]];
                setDataInput((prev) => {
                  const existing = prev.find((di) => di.row === row);
                  if (existing) {
                    return prev.map((di) =>
                      di.row === row
                        ? {
                            row: row,
                            values: [...di.values, e as any],
                          }
                        : di
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        row: row,
                        values: [e as any],
                      },
                    ];
                  }
                });
              }
              indices[row]++;
            });
          reset();
        }
      } else {
        toast({
          title: "No data",
          description: "The file has no parsable input!",
          variant: "destructive",
        });
      }
    }
  };

  if (!importExportDialog) {
    return null;
  }
  return (
    <Dialog
      open={!!importExportDialog}
      onOpenChange={() => setImportExportDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{importExportDialog.type}</DialogTitle>
          <DialogDescription>
            Select the file format you want to use.
            <Alert variant={"default"} className="space-y-2 mt-2">
              <AlertTitle>Formatting rules</AlertTitle>
              <AlertDescription>
                The first row/object is always being set as the columns name.
              </AlertDescription>
            </Alert>
            <div className="p-4 space-y-4">
              {step === 0 && (
                <>
                  <div>
                    <Label>Selected file: {file?.name}</Label>
                  </div>
                  <div
                    className="border-2 border-dashed rounded-lg flex flex-col gap-1 p-6 items-center"
                    onDragOver={handleDragOver}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    onDrop={handleDrop}
                  >
                    <FileIcon className="w-12 h-12" />
                    <span className="text-sm font-medium">
                      Drag and drop a file or click to browse
                    </span>
                    <span className="text-xs">{importExportDialog.format}</span>
                    <input
                      id="file-input"
                      type="file"
                      accept=".xls,.xlsx,.json"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                  </div>
                  <Button disabled={!file} onClick={() => setStep(step + 1)}>
                    Continue
                  </Button>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="flex flex-col space-y-2 mb-2 w-full">
                    <div className="flex flex-col space-y-2">
                      <Label>
                        Select an Excel sheet and a range of rows to import into
                        the application.
                      </Label>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sheet">Sheet</Label>
                          <Select defaultValue="Sheet1">
                            <SelectTrigger>
                              <SelectValue placeholder="Select sheet" />
                            </SelectTrigger>
                            <SelectContent>
                              {workbook?.SheetNames.map((sheet) => (
                                <SelectItem value={sheet} key={sheet}>
                                  {sheet}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rows">
                            Rows (
                            {workbook?.Sheets[workbook?.SheetNames[0]]["!ref"]})
                          </Label>
                          <Input
                            className="w-full"
                            id="rows"
                            placeholder="e.g. A4:B4"
                            type="text"
                            onInput={(e) => {
                              if (submit) setSubmit(false);
                              setSelectedRows(
                                (e.target as HTMLInputElement).value
                              );
                            }}
                          />
                        </div>
                      </div>
                      <Button onClick={previewSelectedData}>
                        {submit ? "Submit" : "Preview"}
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="w-[27rem] whitespace-nowrap h-[50vh] overflow-hidden">
                    <ScrollBar orientation="horizontal" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {[
                            ...new Set(
                              workbook?.Sheets[workbook?.SheetNames[0]][
                                "!data"
                              ]?.[0].map((d: any) => d.v) as any
                            ),
                          ]
                            .map((r: any) => r.toString())
                            .map((d: any, i) => (
                              <TableHead key={i}>
                                {d && (d as string)}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transposeValues(data).map(
                          (rowValues: any, rowIndex: any) => (
                            <TableRow key={rowIndex}>
                              {rowValues.map((value: any, valueIndex: any) => (
                                <TableCell key={`${rowIndex}-${valueIndex}`}>
                                  {value !== null ? value : ""}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
