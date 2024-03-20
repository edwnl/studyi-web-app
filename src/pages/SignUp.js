import firebase from "firebase";
import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Input, Label, Button, HelperText } from "@windmill/react-ui";
import { processErrorCode } from "../utils/utils";
import { useToast } from "@chakra-ui/react";
const { isEmail } = require("../utils/utils");

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if (name && password && confirmPass && email && !loading) {
        handleSubmit(event);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please make sure your email is correct.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (password.length < 6 && confirmPass.length < 6) {
      toast({
        title: "Invalid Passwords",
        description: "Passwords must be longer then 6 characters.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (confirmPass !== password) {
      toast({
        title: "Mismatched Passwords",
        description: "Make sure both the passwords are identical.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCred) => {
        // After user is signed up, update the display name.
        // When user signs up, the user is signed in, and will be directed by react router
        userCred.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            toast.closeAll();
            setLoading(false);
          });
      })
      .catch((error) => {
        toast({
          title: processErrorCode(error.code),
          description: error.message,
          status: "error",
          duration: 5000,
        });
        setLoading(false);
      });
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto">
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <Label>
                <span>Name</span>
                <Input
                  className="mt-1"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Label>
              <Label className="mt-4">
                <span>Email</span>
                <Input
                  className="mt-1"
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  name="password"
                  placeholder="********"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input
                  className="mt-1 mb-6"
                  name="confirmPassword"
                  placeholder="********"
                  type="password"
                  onChange={(e) => setConfirmPass(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Label>

              <Button
                block
                className="mt-4"
                disabled={
                  !name || !password || !confirmPass || !email || loading
                }
                onClick={handleSubmit}
              >
                Create account
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login Here!
                </Link>
              </p>

              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/"
                >
                  Back to Homepage
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
