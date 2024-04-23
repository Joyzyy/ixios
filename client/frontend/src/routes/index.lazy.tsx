import { createLazyFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { countAtom } from "@/features/atoms";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <div>Count: {count}</div>
    </>
  );
}
