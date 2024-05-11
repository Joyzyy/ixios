import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DataInputType } from "./models";

export const countAtom = atomWithStorage("count", 0);
export const actionMenuAtom = atom(false);

export namespace dataInputAtoms {
  export const data = atom<DataInputType[]>([]);
  export const row = atom(0);
  export const column = atom(0);
  export const numberPredetermined = atom(2);
};

// export const dataInputAtom = atom<DataInputType[]>([]);
// export const dataInputRow = atom<number>(0);
// export const dataInputColumn = atom<number>(0);

export const currentActionAtom = atom<string>("");
export const selectedDataForAnalysisAtom = atom<any[]>([]);
export const importExportDialogAtom = atom<{
  type: string;
  format: string;
} | null>(null);
