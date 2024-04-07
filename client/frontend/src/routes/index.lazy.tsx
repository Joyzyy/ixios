import { Button } from "@/components/ui/button";
import { createLazyFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  function dismiss() {
    console.log("got dismissed!");
  }

  return (
    <div className="p-2">
      <h3>
        <Button
          onClick={() => {
            toast("uh oh!", {
              dismissible: true,
              important: true,
              description: "asomsomsamodasdasd",
              action: {
                label: "Undo",
                onClick: dismiss,
              },
            });
          }}
        >
          show sonner
        </Button>
      </h3>
    </div>
  );
}
