import { createLazyFileRoute } from "@tanstack/react-router";
import { ActionMenu } from "@/components/action-menu";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <ActionMenu />
    </>
  );
}
