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
} from "@/features/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DataTable } from "./action_menu/data-table";
import { columns } from "./action_menu/columns";
import type { DataInputType } from "@/features/models";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import { API_URL_V1, identifiers, options } from "@/constants";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

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

    let methods = selectedMethods.map((method) => method.value);
    setIsLoading(true);
    fetch(
      `${API_URL_V1}/statistics/${currentAction === identifiers.DESCRIPTIVE_STATISTICS ? "descriptive" : "inferential"}`,
      {
        method: "POST",
        body: JSON.stringify({
          data: selectedDataForAnalysis,
          methods: methods,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        setActionMenu("statistics_summary");
        return res.json();
      })
      .then((data) => {
        console.log("data: ", data);
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
          <ScrollArea className="w-[28.5rem] whitespace-nowrap overflow-hidden">
            <ScrollBar orientation="horizontal" />
            <div className="text-xl font-semibold mb-2">Variables</div>
            <DataTable columns={columns} data={readableData} />
            <ScrollBar
              orientation="vertical"
              className="absolute right-0 top-0 h-full"
            />
          </ScrollArea>
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Methods</h2>
              <div className="space-y-4">
                <div>
                  <MultipleSelector
                    defaultOptions={
                      currentAction === identifiers.DESCRIPTIVE_STATISTICS
                        ? options.DESCRIPTIVE_STATISTICS
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
