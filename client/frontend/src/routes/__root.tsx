import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { MainMenu } from "@/components/dasboard/menubar";

const DesktopNavigation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <MainMenu />
      <div className="border-t">
        <div className="bg-background">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </>
  );
};

function Routes() {
  return (
    <>
      <div className="p-2">
        <Link to="/">Home</Link> <Link to="/about">About</Link>{" "}
        <Link to="/data">Data</Link>
      </div>
    </>
  );
}

const Root = () => {
  return (
    <>
      <DesktopNavigation children={<Routes />} />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: Root,
});
