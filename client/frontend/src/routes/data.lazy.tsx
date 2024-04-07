import { createLazyFileRoute } from "@tanstack/react-router";
import { DataInput } from "@/components/data-input";

export const Route = createLazyFileRoute("/data")({
  component: () => <DataInput />,
});
