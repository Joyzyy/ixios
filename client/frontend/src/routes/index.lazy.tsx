import { createLazyFileRoute } from "@tanstack/react-router";
import { ActionMenuWrapper } from "@/components/action-menu";
import { ImportExportDialogWrapper } from "@/components/action_menu/import-export";
import { SelectorStatsWrapper } from "@/components/selector_stats";
import { GraphsMenuWrapper } from "@/components/graphs-menu";
import { EquationsMenuWrapper } from "@/components/equations-menu";
import { UserMenuWrapper } from "@/components/user-menu";
import { UserHistoryWrapper } from "@/components/user-history";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <UserMenuWrapper />
      <ActionMenuWrapper />
      <ImportExportDialogWrapper />
      <EquationsMenuWrapper />
      <SelectorStatsWrapper />
      <GraphsMenuWrapper />
      <UserHistoryWrapper />
    </>
  );
}
