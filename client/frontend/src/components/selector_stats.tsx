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
  const setResults = useSetAtom(resultsAtom);
  const dataInput = useAtomValue(dataInputAtoms.data);
  const currentAction = useAtomValue(currentActionAtom);
  const selectedDataForAnalysis = useAtomValue(selectedDataForAnalysisAtom);

  useEffect(() => {
    if (actionMenu === "selector_stats") {
      makeReadable(dataInput);
      setSelectedMethods([]);
    }
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

    if (
      currentAction === identifiers.INFERENTIAL_STATISTICS &&
      selectedDataForAnalysis.length < 2
    ) {
      toast({
        title: "Less data selected",
        description: "Please select at least two data to run analysis.",
      });
      return;
    }

    let methods = selectedMethods.map((method) => method.value);

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
          <div className="flex justify-center items-center">
            <Button onClick={runAnalysis}>Run analysis</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
