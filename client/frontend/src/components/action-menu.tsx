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

const ExtraOptionsAfterAction = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"ghost"}>More...</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <button>@TODO</button>
      </DrawerContent>
    </Drawer>
  );
};

export const ActionMenuWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);
  if (actionMenu !== "statistics_summary") return null;
  return <ActionMenu />;
};

const ActionMenu = () => {
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
                    <StepsComponent
                      steps={results.steps}
                      type={currentAction}
                    />
                  ) : (
                    "There was an error while fetching the data. Please try again."
                  )}
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <ExtraOptionsAfterAction />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
