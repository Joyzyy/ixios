import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  actionMenuAtom,
  currentActionAtom,
  dataInputAtoms,
  importExportDialogAtom,
  userAccountDialogAtom,
  userAtom,
} from "@/features/atoms";
import { identifiers } from "@/constants";
import { DataInputType } from "@/features/models";
import { useToast } from "./ui/use-toast";

const FileMenu = () => {
  const setImportExportDialogAtom = useSetAtom(importExportDialogAtom);

  const MenubarSection = ({
    title,
    formats,
    onMenuClick,
  }: {
    title: string;
    formats: string[];
    onMenuClick: (format: string) => void;
  }) => {
    return (
      <MenubarSub>
        <MenubarSubTrigger>{title}</MenubarSubTrigger>
        <MenubarSubContent>
          {formats.map((format) => (
            <MenubarItem key={format} onClick={() => onMenuClick(format)}>
              {format}
            </MenubarItem>
          ))}
        </MenubarSubContent>
      </MenubarSub>
    );
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarSection
          title="Import"
          formats={["XLS", "CSV", "JSON"]}
          onMenuClick={(format) => {
            setImportExportDialogAtom({ type: "Import", format: format });
          }}
        />
      </MenubarContent>
    </MenubarMenu>
  );
};

const AnalysisMenu = (props: { data: DataInputType[]; toastRef: any }) => {
  const setActionMenuAtom = useSetAtom(actionMenuAtom);
  const setCurrentActionAtom = useSetAtom(currentActionAtom);

  return (
    <MenubarMenu>
      <MenubarTrigger>Analysis</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          onClick={() => {
            if (props.data.length === 0) {
              props.toastRef({
                title: "No data",
                description: "Please import data to run an analysis!",
                variant: "destructive",
              });
              return;
            }
            setActionMenuAtom("selector_stats");
            setCurrentActionAtom(identifiers.DESCRIPTIVE_STATISTICS);
          }}
        >
          {identifiers.DESCRIPTIVE_STATISTICS}
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            if (props.data.length === 0) {
              props.toastRef({
                title: "No data",
                description: "Please import data to run an analysis!",
                variant: "destructive",
              });
              return;
            }
            setActionMenuAtom("selector_stats");
            setCurrentActionAtom(identifiers.INFERENTIAL_STATISTICS);
          }}
        >
          {identifiers.INFERENTIAL_STATISTICS}
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            if (props.data.length === 0) {
              props.toastRef({
                title: "No data",
                description: "Please import data to run an analysis!",
                variant: "destructive",
              });
              return;
            }
            setActionMenuAtom("selector_stats");
            setCurrentActionAtom(identifiers.TIME_SERIES_ANALYSIS);
          }}
        >
          {identifiers.TIME_SERIES_ANALYSIS}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

const GenerateMenu = (props: { data: DataInputType[]; toastRef: any }) => {
  const setActionMenuAtom = useSetAtom(actionMenuAtom);

  return (
    <MenubarMenu>
      <MenubarTrigger>Generate</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          onClick={() => {
            if (props.data.length === 0) {
              props.toastRef({
                title: "No data",
                description: "Please import data to generate graphs.",
                variant: "destructive",
              });
              return;
            }
            setActionMenuAtom("graphs");
          }}
        >
          Graphs
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            if (props.data.length === 0) {
              props.toastRef({
                title: "No data",
                description: "Please import data to generate equations.",
                variant: "destructive",
              });
              return;
            }
            setActionMenuAtom("equations");
          }}
        >
          Equations
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export const UserAccountMenu = () => {
  const setUserAccountDialog = useSetAtom(userAccountDialogAtom);
  const [user, setUser] = useAtom(userAtom);

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-bold">IXIOS</MenubarTrigger>
      <MenubarContent>
        {user ? (
          <>
            <MenubarItem>{user.username}</MenubarItem>
            <MenubarItem>History</MenubarItem>
            <MenubarItem
              onClick={() => {
                setUser(null);
              }}
            >
              Logout
            </MenubarItem>
          </>
        ) : (
          <>
            <MenubarItem
              onClick={() =>
                setUserAccountDialog({
                  type: "Login",
                })
              }
            >
              Login
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                setUserAccountDialog({
                  type: "Register",
                })
              }
            >
              Register
            </MenubarItem>
          </>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
};

export const MainMenu = () => {
  const data = useAtomValue(dataInputAtoms.data);
  const { toast } = useToast();

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <UserAccountMenu />
      <FileMenu />
      <AnalysisMenu data={data} toastRef={toast} />
      <GenerateMenu data={data} toastRef={toast} />
    </Menubar>
  );
};
