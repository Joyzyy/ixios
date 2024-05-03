import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/theme-provider";
import "./style.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root")!;
if (!container.innerHTML) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={"dark"} storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}
