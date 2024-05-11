import { createLazyFileRoute } from "@tanstack/react-router";
import { ActionMenu } from "@/components/action-menu";
import { ImportExportDialog } from "@/components/action_menu/import-export";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <ActionMenu />
      <ImportExportDialog />
    </>
  );
}
