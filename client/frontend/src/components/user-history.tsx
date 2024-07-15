import { actionMenuAtom, userAtom } from "@/features/atoms";
import { useAtom, useAtomValue } from "jotai";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { useEffect, useState } from "react";
import { API_URL_V1 } from "@/constants";
import { StepsComponent } from "./action_menu/steps";

export const UserHistoryWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);
  const user = useAtomValue(userAtom);
  if (actionMenu !== "user_history" && user === null) return null;
  return <UserHistory user={user} />;
};

function UserHistory(props: any) {
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (actionMenu !== "user_history" || props.user === null) return;
    const fetchHistory = async () => {
      const response = await fetch(`${API_URL_V1}/user/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.user.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user history");
          }
          return res.json();
        })
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return [];
        });
      console.log(response);
      setHistory(response);
    };
    fetchHistory();
    return () => {
      setActionMenu("");
      setHistory([]);
    };
  }, [actionMenu === "user_history"]);

  return (
    <Drawer
      open={actionMenu === "user_history" && props.user !== null}
      onClose={() => setActionMenu("")}
      modal={true}
    >
      <DrawerContent className="h-full p-4">
        <DrawerHeader>
          <DrawerTitle className="border-b border-primary pb-4">
            <h1 className="text-2xl font-semibold">
              {props.user.username}'s operation history
            </h1>
          </DrawerTitle>
          <DrawerDescription className="mt-6 grid gap-6">
            <div className="p-6 space-y-4 overflow-y-auto h-[83.5vh] w-full border rounded-lg">
              <div className="space-y-4">
                <div className="text-sm">
                  {history.length > 0 ? (
                    history.map((operation, idx) => (
                      <div key={idx} className="mt-8">
                        <StepsComponent
                          steps={JSON.parse(operation.json).result}
                          type={operation.operation}
                          time={operation.time}
                        />
                      </div>
                    ))
                  ) : (
                    <p>You have no operations history!</p>
                  )}
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
