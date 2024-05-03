import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DataInputType } from "./models";

export const countAtom = atomWithStorage("count", 0);
export const actionMenuAtom = atom(false);
export const dataInputAtom = atom<DataInputType[]>([]);
export const currentActionAtom = atom<string>("");
export const selectedDataForAnalysisAtom = atom<any[]>([]);
