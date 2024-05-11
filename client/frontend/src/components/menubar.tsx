import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  actionMenuAtom,
  currentActionAtom,
  importExportDialogAtom,
} from "@/features/atoms";

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

export const MainMenu = () => {
  const setActionMenuAtom = useSetAtom(actionMenuAtom);
  const setImportExportDialogAtom = useSetAtom(importExportDialogAtom);
  const setCurrentActionAtom = useSetAtom(currentActionAtom);

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">IXIOS</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About this app</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Hide sheet... <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Hide all... <MenubarShortcut>⇧⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Quit <MenubarShortcut>⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>New</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                New file <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                File from history <i className="mr-3" />{" "}
                <MenubarShortcut>⇧⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                File folder <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Open... <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Clear file <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSection
            title="Import"
            formats={["XLS", "CSV", "JSON"]}
            onMenuClick={(format) => {
              setImportExportDialogAtom({ type: "Import", format: format });
            }}
          />
          <MenubarSection
            title="Export"
            formats={["XLS", "CSV", "JSON"]}
            onMenuClick={(format) => {
              setImportExportDialogAtom({ type: "Export", format: format });
            }}
          />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Action</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => {
              setActionMenuAtom(true);
              setCurrentActionAtom("Simple statistics");
            }}
          >
            Simple statistics
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              setActionMenuAtom(true);
              setCurrentActionAtom("Econometrics");
            }}
          >
            Advanced statistics - Econometrics
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Equation</MenubarTrigger>
        <MenubarContent></MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Visualize</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
};
