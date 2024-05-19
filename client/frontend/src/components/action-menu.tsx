import {
  Drawer,
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
  resultsAtom,
} from "@/features/atoms";
import { useAtom, useAtomValue } from "jotai";
import { StepsComponent } from "./action_menu/steps";
import { Button } from "./ui/button";

export const ActionMenu = () => {
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const currentAction = useAtomValue(currentActionAtom);
  const results = useAtomValue(resultsAtom);

  return (
    <Drawer
      open={actionMenu === "statistics_summary"}
      onClose={() => setActionMenu("")}
      modal={true}
    >
      <DrawerContent className="h-full p-4">
        <DrawerHeader>
          <DrawerTitle className="border-b border-primary pb-4">
            <h1 className="text-2xl font-semibold">IXIOS - {currentAction}</h1>
          </DrawerTitle>
          <DrawerDescription className="mt-6 grid gap-6">
            <div className="p-6 space-y-4 overflow-y-auto h-[83.5vh] w-full border rounded-lg">
              <div className="space-y-4">
                <div className="text-sm">
                  {results.steps ? (
                    <StepsComponent steps={results.steps} />
                  ) : (
                    "There was an error while fetching the data. Please try again."
                  )}
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Drawer>
            <DrawerTrigger>
              <Button variant={"ghost"} className="w-full">
                Graphs
              </Button>
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
