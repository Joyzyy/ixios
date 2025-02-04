import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MainMenu } from "@/components/menubar";
import { DataInput } from "@/components/data-input";
import { Toaster } from "@/components/ui/toaster";

const DesktopNavigation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <MainMenu />
      <div className="border-t overflow-hidden h-15">
        <div className="bg-background">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

const Root = () => {
  return (
    <>
      <DesktopNavigation children={<DataInput />} />
      <Outlet />
      <Toaster />
    </>
  );
};

export const Route = createRootRoute({
  component: Root,
});
