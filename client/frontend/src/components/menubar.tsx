import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
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
import { Button } from "./ui/button";

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

  function IconCircleUser(props: any) {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
      >
        <path d="M399 384.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zm-256 16c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72z" />
      </svg>
    );
  }

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-bold" asChild>
        <Button variant={"ghost"}>
          <IconCircleUser className="w-full h-full" />
        </Button>
      </MenubarTrigger>
      <MenubarContent className="mr-6">
        {user ? (
          <>
            <MenubarItem>{user.username}</MenubarItem>
            <MenubarItem>History</MenubarItem>
            <MenubarSeparator />
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
    <Menubar className="flex flex-row justify-between rounded-none border-b border-none px-2 lg:px-4">
      <div className="flex flex-row space-x-2">
        <MenubarLabel>IXIOS</MenubarLabel>
        <FileMenu />
        <AnalysisMenu data={data} toastRef={toast} />
        <GenerateMenu data={data} toastRef={toast} />
      </div>
      <div className="mr-8">
        <UserAccountMenu />
      </div>
    </Menubar>
  );
};
