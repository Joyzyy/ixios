import { dataInputAtoms, importExportDialogAtom } from "@/features/atoms";
import { useAtom, useSetAtom } from "jotai";
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

export const ImportExportDialog: React.FC = () => {
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

  useEffect(() => {
    const handle = async () => {
      if (file) {
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
    if (sheet) {
      const data = xlsx.utils.sheet_to_json(sheet);
      if (selectedRows) {
        const [start, end] = selectedRows.split(":");
        const startRow = parseInt(start.replace(/\D/g, ""));
        const endRow = parseInt(end.replace(/\D/g, ""));
        setData(data.slice(startRow - 1, endRow));
      } else {
        setData(data);
      }
      setSubmit(true);
    }

    if (submit) {
      const res: {
        row: string;
        values: number[];
      }[] = data.reduce((acc, item: { [key: string]: number }) => {
        Object.entries(item).forEach(([key, value]) => {
          const existingItem = acc.find((x: any) => x.row === key);
          if (existingItem) existingItem.values.push(value);
          else acc.push({ row: key, values: [value] });
        });
        return acc;
      }, []);
      let indices: any = {};
      Array.from(
        document.querySelectorAll<HTMLInputElement>(
          "input[type=number][id^=cell-]"
        )
      )
        .sort((a, b) => {
          return a.id.split("-")[1].localeCompare(b.id.split("-")[1]);
        })
        .forEach((e) => {
          const row = e.id.split("-")[1];
          if (!indices[row]) indices[row] = 0;
          const r = res.find((r) => r.row === row);
          if (r) {
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
                      accept=".xls,.xlsx,.csv,.xml"
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {workbook?.Sheets[workbook?.SheetNames[0]][
                          "!data"
                        ]?.[0].map((d, i) => (
                          <TableHead>{d && (d.v as string)}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow>
                          {Object.values(row).map((v: any) => (
                            <TableCell>{v}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
