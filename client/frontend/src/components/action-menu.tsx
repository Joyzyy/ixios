import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  actionMenuAtom,
  currentActionAtom,
  dataInputAtom,
  selectedDataForAnalysisAtom,
} from "@/features/atoms";
import { DataInputType } from "@/features/models";
import { useAtom } from "jotai";
import { useState } from "react";
import { DataTable } from "./action_menu/data-table";
import { columns } from "./action_menu/columns";
import { Button } from "./ui/button";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { API_URL_V1, SIMPLE_STATISTICS_OPTIONS } from "@/constants";
import { StepsComponent } from "./action_menu/steps";

export const ActionMenu = () => {
  const { toast } = useToast();
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const [dataInput] = useAtom(dataInputAtom);
  const [currentAction] = useAtom(currentActionAtom);
  const [selectedDataForAnalysis] = useAtom(selectedDataForAnalysisAtom);
  const [readableData, setReadableData] = useState<any>([]);
  const [selectedMethods, setSelectedMethods] = useState<Option[]>([]);
  const [results, setResults] = useState<{
    steps?: string;
    result?: string;
  }>({});

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

    let selectedData = selectedDataForAnalysis[0];
    let methods = selectedMethods.map((method) => method.value);

    console.time("now");
    fetch(`${API_URL_V1}/simple_statistics`, {
      method: "POST",
      body: JSON.stringify({
        data: selectedData,
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
    console.timeEnd("now");
  };

  return (
    <Drawer
      open={actionMenu}
      onClose={() => setActionMenu(false)}
      onOpenChange={() => makeReadable(dataInput)}
      modal={true}
    >
      <DrawerContent className="h-full p-4">
        <DrawerHeader>
          <DrawerTitle className="border-b border-primary pb-4">
            <h1 className="text-2xl font-semibold">IXIOS - {currentAction}</h1>
          </DrawerTitle>
          <DrawerDescription className="mt-6 grid gap-6">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
              <div className={cn("p-6 space-y-4")}>
                <h2 className="text-xl font-semibold">Variables</h2>
                <DataTable columns={columns} data={readableData} />
              </div>
              <div className={cn("p-6 space-y-4")}>
                <h2 className="text-xl font-semibold">Analysis method</h2>
                <div className="space-y-4">
                  <div>
                    <MultipleSelector
                      defaultOptions={SIMPLE_STATISTICS_OPTIONS}
                      onChange={setSelectedMethods}
                      value={selectedMethods}
                      placeholder="Select analysis method"
                      hidePlaceholderWhenSelected
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </div>
                  <Button variant={"secondary"} onClick={runAnalysis}>
                    Run analysis
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto h-[50vh] w-full border rounded-lg">
              <div className="space-y-4">
                <div className="text-sm">
                  {results.steps ? (
                    <StepsComponent steps={results.steps} />
                  ) : (
                    "aaa"
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Result</h3>
                  {Object.keys(results).length === 0 ? (
                    <p>No analysis run yet.</p>
                  ) : (
                    <p>{results.result}</p>
                  )}
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Drawer>
            <DrawerTrigger>
              <button className="w-full">Preferences...</button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh]">
              <button>General</button>
              <button>Advanced</button>
            </DrawerContent>
          </Drawer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
