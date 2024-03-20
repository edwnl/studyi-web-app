import React, { useEffect, useState } from "react";

import firebase from "firebase";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label } from "@windmill/react-ui";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "../utils/useAuthHook";
import SectionTitle from "../components/Typography/SectionTitle";
import { processErrorCode } from "../utils/utils";
import { isEmail } from "../utils/utils";

export default function Profile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [updating, setUpdating] = useState("NONE");
  const { user } = useAuth();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef();
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    setName(user.displayName);
    setEmail(user.email);
  }, [user.displayName, user.email]);

  function processError(error) {
    toast({
      title: processErrorCode(error.code),
      description: error.message,
      status: "error",
      duration: 5000,
    });
    setUpdating("NONE");
  }

  const updatePassword = () => {
    if (!password) {
      toast({
        title: "Password must not be empty!",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password is too short!",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setUpdating("PASSWORD");

    firebase
      .auth()
      .currentUser.updatePassword(password)
      .then(() => {
        toast({
          title: "Success!",
          description: "Password changed.",
          status: "success",
          duration: 5000,
        });
        setUpdating("NONE");
        setPassword("");
      })
      .catch((error) => {
        processError(error);
      });
  };

  const updateName = () => {
    if (!name) {
      toast({
        title: "Name must not be empty!",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (name.length > 20) {
      toast({ title: "Name is too long!", status: "error", duration: 3000 });
      return;
    }

    setUpdating("NAME");

    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: name,
      })
      .then(() => {
        toast({
          title: "Success!",
          description: "Your name has been changed to " + name + ".",
          status: "success",
          duration: 5000,
        });
        setUpdating("NONE");
      })
      .catch((error) => {
        processError(error);
      });
  };

  const updateEmail = () => {
    if (!email) {
      toast({
        title: "Email must not be empty!",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!isEmail(email)) {
      toast({
        title: "Invalid email address!",
        description: "Please double check you have entered an email address.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setUpdating("EMAIL");

    firebase
      .auth()
      .currentUser.updateEmail(email)
      .then(() => {
        toast({
          title: "Success!",
          description: `Your email address is now ${email}.`,
          status: "success",
          duration: 5000,
        });
        setUpdating("NONE");
      })
      .catch((error) => {
        processError(error);
      });
  };

  const deleteAccount = () => {
    setUpdating("ACCOUNT_DELETION");
    // The user is deleted from firebase auth
    // The extension "delete user data" will remove all data from database
    firebase
      .auth()
      .currentUser.delete()
      .then((r) => {
        setUpdating("NONE");
      })
        .catch((error) => {
          processError(error);
          setIsOpen(false);
        });

  };

  return (
    <>
      <PageTitle>Edit Account</PageTitle>

      <div className="px-4 py-4 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Update Name</SectionTitle>

        <Label>
          <span>Name</span>
          <Input
            value={name}
            className="mt-2"
            onChange={(e) => setName(e.target.value)}
            placeholder="Studyi User"
          />
        </Label>

        <Button
          isLoading={updating === "NAME"}
          className={"mt-4"}
          colorScheme="studyi"
          isFullWidth={true}
          onClick={updateName}
        >
          Save
        </Button>
      </div>

      <div className="px-4 py-4 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Update Password</SectionTitle>

        <Label className="mt-4">
          <span>Password</span>
          <Input
            className="mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            type="password"
          />
        </Label>

        <Button
          isLoading={updating === "PASSWORD"}
          className={"mt-4"}
          colorScheme="studyi"
          isFullWidth={true}
          onClick={updatePassword}
        >
          Change Password
        </Button>
      </div>

      <div className="px-4 py-4 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Update Email</SectionTitle>

        <Label className="mt-4">
          <span>Email</span>
          <Input
            className="mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
          />
        </Label>

        <Button
          className={"mt-4"}
          isLoading={updating === "EMAIL"}
          colorScheme="studyi"
          isFullWidth={true}
          onClick={updateEmail}
        >
          Save Email
        </Button>
      </div>

      <Button
        className={"mb-4"}
        colorScheme="red"
        isFullWidth={true}
        onClick={(e) => setIsOpen(true)}
      >
        Delete Account
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteAccount}
                ml={3}
                isLoading={updating === "ACCOUNT_DELETION"}
                loadingText="Deleting Account..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
