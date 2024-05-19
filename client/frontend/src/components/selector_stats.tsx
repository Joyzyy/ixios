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
  methodsAtom,
  resultsAtom,
} from "@/features/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DataTable } from "./action_menu/data-table";
import { columns } from "./action_menu/columns";
import type { DataInputType } from "@/features/models";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import { API_URL_V1, SIMPLE_STATISTICS_OPTIONS } from "@/constants";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export const SelectorStats: React.FC = () => {
  const { toast } = useToast();
  const [readableData, setReadableData] = useState<any[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<Option[]>([]);
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const setResults = useSetAtom(resultsAtom);
  const dataInput = useAtomValue(dataInputAtoms.data);
  const selectedDataForAnalysis = useAtomValue(selectedDataForAnalysisAtom);

  useEffect(() => {
    if (actionMenu === "selector_stats") {
      makeReadable(dataInput);
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

    if (selectedDataForAnalysis.length > 1) {
      toast({
        title: "Multiple data selected",
        description: "Please select only one data to run analysis.",
      });
      return;
    }

    let methods = selectedMethods.map((method) => method.value);

    setActionMenu("statistics_summary");

    fetch(`${API_URL_V1}/simple_statistics`, {
      method: "POST",
      body: JSON.stringify({
        data: selectedDataForAnalysis,
        methods: methods,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResults({
          steps: data.steps,
          result: data.result,
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
          <>
            <div className="text-xl font-semibold">Variables</div>
            <DataTable columns={columns} data={readableData} />
          </>
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Methods</h2>
              <div className="space-y-4">
                <div>
                  <MultipleSelector
                    defaultOptions={SIMPLE_STATISTICS_OPTIONS}
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
