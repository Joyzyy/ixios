import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  actionMenuAtom,
  dataInputAtoms,
  equationsAtom,
} from "@/features/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useToast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EquationsMenuWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);

  if (actionMenu !== "equations") return null;
  return <EquationsMenu />;
};

const EquationsMenu: React.FC = () => {
  const [equation, setEquation] = useState<
    {
      row: string;
      transformation: string;
      formattedEquation?: string;
    }[]
  >([]);
  const [equations, setEquations] = useAtom(equationsAtom);
  const { toast } = useToast();
  const rows = useAtomValue(dataInputAtoms.rows);

  useEffect(() => {
    return () => {
      setEquation([]);
    };
  }, []);

  const handleEquation = (t: string, r: string) => {
    setEquation([
      ...equation,
      {
        row: r,
        transformation: t,
        formattedEquation: formatEquation({ row: r, transformation: t }),
      },
    ]);
  };

  const formatEquation = (equation: any) => {
    return equation.transformation + "(" + equation.row + ")";
  };

  const handleSaveEquation = () => {
    if (!equation) {
      toast({
        title: "Equation cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setEquations((prev: any) => {
      return [...prev, equation];
    });
    setActionMenu("");
  };

  const formatData = (data: any) => {
    return data
      .map((group: any) =>
        group.map((item: any) => item.formattedEquation).join(" ")
      )
      .join(", ");
  };

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
            {equations.length > 0 && (
              <Alert className="mt-2">
                <AlertTitle>Previously generated equations</AlertTitle>
                <AlertDescription>{formatData(equations)}</AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center space-y-4 w-full">
          {rows.map((row) => (
            <div
              className="flex flex-row justify-center items-center space-x-4 w-full"
              key={row}
            >
              <h3 className="text-lg font-semibold">{row}</h3>
              <Select
                onValueChange={(transformation) =>
                  handleEquation(transformation, row)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select a transformation to be applied on the variable ${row}`}
                  ></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Transformations</SelectLabel>
                    <SelectItem value={"log"}>Log</SelectItem>
                    <SelectItem value={"exp"}>Exp</SelectItem>
                    <SelectItem value={"sqrt"}>Sqrt</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => handleSaveEquation()}>Save equation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
