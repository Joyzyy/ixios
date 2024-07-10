import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actionMenuAtom } from "@/features/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const EquationsMenuWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);

  if (actionMenu !== "equations") return null;
  return <EquationsMenu />;
};

const EquationsMenu: React.FC = () => {
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  return (
    <Dialog
      open={actionMenu === "equations"}
      onOpenChange={() => setActionMenu("")}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate an equation.</DialogTitle>
          <DialogDescription>
            Generate an equation based off the available dataset.
          </DialogDescription>
        </DialogHeader>
        <Input type="text" placeholder="Ex. log(a) log(b) log(c)" />
        <DialogFooter>
          <Button onClick={() => setActionMenu("")}>Save equation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
