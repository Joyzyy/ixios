import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  actionMenuAtom,
  dataInputAtoms,
  selectedDataForAnalysisAtom,
  resultsAtom,
  currentActionAtom,
  equationsAtom,
  userAtom,
} from "@/features/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DataTable } from "./action_menu/data-table";
import { columns } from "./action_menu/columns";
import type { DataInputType } from "@/features/models";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import {
  API_URL_V1,
  identifiers,
  options,
  TIME_SERIES_FREQUENCIES,
} from "@/constants";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export const SelectorStatsWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);

  if (actionMenu !== "selector_stats") return null;
  return <SelectorStats />;
};

const SelectorStats: React.FC = () => {
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const { toast } = useToast();
  const [readableData, setReadableData] = useState<any[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<Option[]>([]);
  const [selectedEquations, setSelectedEquations] = useState<Option[]>([]);
  const setResults = useSetAtom(resultsAtom);
  const dataInput = useAtomValue(dataInputAtoms.data);
  const currentAction = useAtomValue(currentActionAtom);
  const selectedDataForAnalysis = useAtomValue(selectedDataForAnalysisAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const equations = useAtomValue(equationsAtom);
  const [formattedEquations, setFormattedEquations] = useState<Option[]>([]);
  const [tsFreq, setTsFreq] = useState("");
  const [tsFreqOpen, setTsFreqOpen] = useState(false);
  const [arima, setArima] = useState({ ar: 0, i: 0, ma: 0 });
  const userValue = useAtomValue(userAtom);

  useEffect(() => {
    if (actionMenu === "selector_stats") {
      makeReadable(dataInput);
      if (equations.length > 0) formatEquation(equations);
      setSelectedMethods([]);
    }

    return () => {
      setReadableData([]);
      setSelectedMethods([]);
      setSelectedEquations([]);
      setTsFreqOpen(false);
      setArima({ ar: 0, i: 0, ma: 0 });
    };
  }, [actionMenu]);

  const makeReadable = (data: DataInputType[]) => {
    let pbRequestData = data.map((item) => {
      return {
        row: item.row,
        values: item.values.map((ref: any) => Number(ref.value)),
      };
    });
    setReadableData(pbRequestData);
  };

  const formatEquation = (equation: typeof equations) => {
    let format = equation.map((item) => {
      let label = item
        .map((itm) => itm.transformation + "(" + itm.row + ")")
        .join(" ");
      let value = JSON.stringify(item);
      return { label, value };
    });
    setFormattedEquations(format);
  };

  const runAnalysis = () => {
    if (selectedMethods.length === 0) {
      toast({
        title: "No analysis method selected",
        description: "Please select an analysis method to run analysis.",
      });
      return;
    } else if (selectedDataForAnalysis.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select data to run analysis.",
      });
      return;
    }

    if (currentAction === identifiers.INFERENTIAL_STATISTICS) {
      if (selectedDataForAnalysis.length < 2) {
        toast({
          title: "Less data selected",
          description: "Please select at least two data to run analysis.",
          variant: "destructive",
        });
        return;
      }

      if (
        readableData.map((item) => item.values.length).some((item) => item < 2)
      ) {
        toast({
          title: "Less data selected",
          description:
            "Please select a dataset with more than 1 value per variable.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentAction === identifiers.TIME_SERIES_ANALYSIS) {
      if (
        readableData
          .map((item) => item.values.length)
          .some((item) => item <= 3) &&
        selectedMethods.some((method) => method.value === "adf")
      ) {
        toast({
          title: "ADF test requires more data",
          description:
            "Please select a dataset with more than 3 values per variable.",
          variant: "destructive",
        });
        return;
      }
    }

    let rows = selectedDataForAnalysis.map((item) => item.row);
    if (
      selectedEquations.length > 0 &&
      selectedEquations.some((eq) => {
        let equation = JSON.parse(eq.value);
        return equation.some((eq: any) => !rows.includes(eq.row));
      })
    ) {
      toast({
        title: "Equation row mismatch",
        description:
          "Please select equations with rows that are in the selected data.",
        variant: "destructive",
      });
      return;
    }

    if (
      selectedDataForAnalysis.some(
        (item) =>
          item.values.length !== selectedDataForAnalysis[0].values.length
      )
    ) {
      toast({
        title: "Variable length mismatch",
        description: "Please select variables with the same length.",
        variant: "destructive",
      });
      return;
    }

    if (
      selectedMethods.some(
        (methods) => methods.value === "range_unit_root_test"
      ) &&
      readableData.some((item) => item.values.length <= 25)
    ) {
      toast({
        title: "Range unit root test requires more data",
        description:
          "Please select a dataset with more than 25 values per variable.",
        variant: "destructive",
      });
      return;
    }

    if (
      selectedMethods.some((methods) => methods.value === "arma") &&
      selectedMethods.some((methods) => methods.value === "arima")
    ) {
      toast({
        title: "Cant select both ARMA and ARIMA",
        description: "Please select only one method for time series analysis.",
        variant: "destructive",
      });
      return;
    }

    let methods = selectedMethods.map((method) => method.value);
    setIsLoading(true);

    let requestBody = {
      url: `${API_URL_V1}/statistics/${
        currentAction === identifiers.DESCRIPTIVE_STATISTICS
          ? "descriptive"
          : currentAction === identifiers.TIME_SERIES_ANALYSIS
            ? "time_series"
            : "inferential"
      }`,
      body: {
        data: selectedDataForAnalysis,
        methods: methods,
      } as any,
    };

    if (currentAction === identifiers.TIME_SERIES_ANALYSIS) {
      requestBody.body["ts_specific"] = {
        frequency: tsFreq,
      };
      if (arima) {
        requestBody.body["ts_specific"]["arima"] = arima;
      }
    } else if (currentAction === identifiers.INFERENTIAL_STATISTICS) {
      requestBody.body["if_specific"] = {
        equations: selectedEquations.map((eq) => JSON.parse(eq.value)),
      };
    }

    fetch(requestBody.url, {
      method: "POST",
      body: JSON.stringify(requestBody.body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userValue?.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        setActionMenu("statistics_summary");
        return res.json();
      })
      .then((data) => {
        if (!data.result) {
          setResults({
            steps: data,
          });
        }
        setResults({
          steps: data.result,
        });
      })
      .catch((err) => {
        console.error("err: ", err);
        toast({
          title: "Failed to fetch data",
          description: "Please try again later.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (actionMenu !== "selector_stats") return null;
  return (
    <Dialog
      open={actionMenu === "selector_stats"}
      onOpenChange={() => setActionMenu("")}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select data & methods</DialogTitle>
          <DialogDescription>
            Select the statistic data you want to make operation on & the
            methods
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {currentAction === identifiers.TIME_SERIES_ANALYSIS && (
            <>
              <Alert>
                <AlertTitle>Rules to follow</AlertTitle>
                <AlertDescription>
                  When doing a time series analysis you need to set a frequency
                  of your data (monthly, yearly, etc)
                </AlertDescription>
              </Alert>
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Seasonality of the data
                </h2>
                <Popover open={tsFreqOpen} onOpenChange={setTsFreqOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      role="combobox"
                      aria-expanded={tsFreqOpen}
                      className="w-[200px] justify-between"
                    >
                      {tsFreq
                        ? TIME_SERIES_FREQUENCIES.find(
                            (item) => item.value === tsFreq
                          )?.label
                        : "Select"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search frequency" />
                      <CommandList>
                        <CommandEmpty>No frequency found.</CommandEmpty>
                        <CommandGroup>
                          {TIME_SERIES_FREQUENCIES.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.value}
                              onSelect={(value) => {
                                setTsFreq((v) => (v === value ? "" : value));
                                setTsFreqOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.value === tsFreq
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
          <ScrollArea className="w-[28.5rem] whitespace-nowrap overflow-hidden">
            <ScrollBar orientation="horizontal" />
            <div className="text-xl font-semibold mb-2">Variables</div>
            <DataTable columns={columns} data={readableData} />
            <ScrollBar
              orientation="vertical"
              className="absolute right-0 top-0 h-full"
            />
          </ScrollArea>
          {currentAction === identifiers.TIME_SERIES_ANALYSIS &&
            selectedMethods.some(
              (method) => method.value === "arma" || method.value === "arima"
            ) && (
              <>
                <div className="flex flex-row justify-between items-center">
                  <h2 className="text-xl font-semibold">ARMA selection</h2>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div className="space-y-4 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-semibold">AR</h2>
                    <Input
                      type="number"
                      placeholder="AR"
                      defaultValue={0}
                      className="w-[75%]"
                      onInput={(e) => {
                        e.preventDefault();
                        if (Number.isNaN(e.currentTarget.value)) {
                          toast({
                            title: "Invalid input",
                            description: "Please enter a valid number.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setArima({
                          ...arima,
                          ar: Number(e.currentTarget.value),
                        });
                      }}
                    />
                  </div>
                  {selectedMethods.some(
                    (method) => method.value === "arima"
                  ) && (
                    <div className="space-y-4 flex flex-col justify-center items-center">
                      <h2 className="text-xl font-semibold">I</h2>
                      <Input
                        type="number"
                        placeholder="I"
                        defaultValue={0}
                        className="w-[75%]"
                        onInput={(e) => {
                          e.preventDefault();
                          if (Number.isNaN(e.currentTarget.value)) {
                            toast({
                              title: "Invalid input",
                              description: "Please enter a valid number.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setArima({
                            ...arima,
                            i: Number(e.currentTarget.value),
                          });
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-4 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-semibold">MA</h2>
                    <Input
                      type="number"
                      placeholder="MA"
                      defaultValue={0}
                      className="w-[75%]"
                      onInput={(e) => {
                        e.preventDefault();
                        if (Number.isNaN(e.currentTarget.value)) {
                          toast({
                            title: "Invalid input",
                            description: "Please enter a valid number.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setArima({
                          ...arima,
                          ma: Number(e.currentTarget.value),
                        });
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Methods</h2>
              <div className="space-y-4">
                <div>
                  <MultipleSelector
                    defaultOptions={
                      currentAction === identifiers.DESCRIPTIVE_STATISTICS
                        ? options.DESCRIPTIVE_STATISTICS
                        : currentAction === identifiers.TIME_SERIES_ANALYSIS
                          ? options.TIME_SERIES_ANALYSIS
                          : options.INFERENTIAL_STATISTICS
                    }
                    onChange={setSelectedMethods}
                    value={selectedMethods}
                    placeholder="Select analysis methods"
                    hidePlaceholderWhenSelected
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </>
          {currentAction === identifiers.INFERENTIAL_STATISTICS &&
            formattedEquations.length > 0 && (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Equations</h2>
                  <div className="space-y-4">
                    <div>
                      <MultipleSelector
                        defaultOptions={formattedEquations}
                        onChange={setSelectedEquations}
                        value={selectedEquations}
                        placeholder="Select equations"
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          <div className="flex justify-center items-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            ) : (
              <Button onClick={runAnalysis}>Run analysis</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
