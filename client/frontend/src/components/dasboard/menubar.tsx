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

export const MainMenu = () => {
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
          <MenubarSub>
            <MenubarSubTrigger>Import</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>XLS</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
              <MenubarItem>JSON</MenubarItem>
              <MenubarItem>SQL</MenubarItem>
              <MenubarItem>XML</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>XLS</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
              <MenubarItem>JSON</MenubarItem>
              <MenubarItem>SQL</MenubarItem>
              <MenubarItem>XML</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
