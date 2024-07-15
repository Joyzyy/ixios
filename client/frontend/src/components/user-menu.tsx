import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAtom, useSetAtom } from "jotai";
import { userAccountDialogAtom, userAtom } from "@/features/atoms";
import { useState } from "react";
import { API_URL_V1 } from "@/constants";

const LoginDialog = (props: any) => {
  const [user, setUser] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>();
  const setUserAtom = useSetAtom(userAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_URL_V1}/user/login`, {
      method: "POST",
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Bad user credentials");
        }
        return res.json();
      })
      .then((data: { username: string; token: string }) => {
        setError(null);
        setUserAtom(data);
        props.setUserAccountDialog(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Login into your account to access your data.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="col-span-3"
            onInput={(e) => {
              setUser({ ...user, email: e.currentTarget.value });
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            className="col-span-3"
            onInput={(e) =>
              setUser({ ...user, password: e.currentTarget.value })
            }
          />
        </div>
      </div>
      {error && (
        <Alert className="mt-[-12px]" variant={"destructive"}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit}>
          Login
        </Button>
      </DialogFooter>
    </>
  );
};

const RegisterDialog = (props: any) => {
  const [user, setUser] = useState<{
    username?: string;
    password?: string;
    email?: string;
  }>({});
  const [error, setError] = useState<string | null>();
  const setUserAtom = useSetAtom(userAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_URL_V1}/user/register`, {
      method: "POST",
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("There was an error processing your request!");
        }
        return res.json();
      })
      .then((data) => {
        setError(null);
        props.setUserAccountDialog(null);
        setUserAtom(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>
          Create an account for free to access benefits.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="usernmae" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            className="col-span-3"
            onInput={(e) => {
              setUser({ ...user, username: e.currentTarget.value });
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className="col-span-3"
            placeholder="johndoe@gmail.com"
            onInput={(e) => {
              setUser({ ...user, email: e.currentTarget.value });
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            className="col-span-3"
            placeholder="*****"
            onInput={(e) => {
              setUser({ ...user, password: e.currentTarget.value });
            }}
          />
        </div>
      </div>
      {error && (
        <Alert className="mt-[-12px]" variant={"destructive"}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit}>
          Register
        </Button>
      </DialogFooter>
    </>
  );
};

const UserMenu: React.FC<{
  userAccountDialog: any;
  setUserAccountDialog: (value: any) => void;
}> = (props) => {
  return (
    <Dialog
      open={!!props.userAccountDialog}
      onOpenChange={() => props.setUserAccountDialog(null)}
      modal={true}
    >
      <DialogContent className="sm:max-w-[425px]">
        {props.userAccountDialog.type === "Login" && (
          <LoginDialog setUserAccountDialog={props.setUserAccountDialog} />
        )}
        {props.userAccountDialog.type === "Register" && (
          <RegisterDialog setUserAccountDialog={props.setUserAccountDialog} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export const UserMenuWrapper = () => {
  const [userAccountDialog, setUserAccountDialog] = useAtom(
    userAccountDialogAtom
  );

  if (!userAccountDialog) return null;

  return (
    <UserMenu
      userAccountDialog={userAccountDialog}
      setUserAccountDialog={setUserAccountDialog}
    />
  );
};
