import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DataInputType } from "./models";
import { STATISTIC_VARIABLES, NUMBER_PREDETERMINED } from "@/constants";

export const countAtom = atomWithStorage("count", 0);
export const actionMenuAtom = atom(false);

export namespace dataInputAtoms {
  export const data = atom<DataInputType[]>([]);
  export const rows = atom(STATISTIC_VARIABLES.slice(0, NUMBER_PREDETERMINED));
  export const columns = atom(NUMBER_PREDETERMINED);
  export const noColumns = atom(NUMBER_PREDETERMINED * 5);
}
export const currentActionAtom = atom<string>("");
export const selectedDataForAnalysisAtom = atom<any[]>([]);
export const importExportDialogAtom = atom<{
  type: string;
  format: string;
} | null>(null);
