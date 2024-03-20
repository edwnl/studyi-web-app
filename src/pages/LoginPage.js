import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Label, Input } from "@windmill/react-ui";
import firebase from "firebase";
import { useToast } from "@chakra-ui/react";

// isEmail is a util function which uses regex and checks if a string is formatted as an email.
const { isEmail } = require("../utils/utils");
const { processErrorCode } = require("../utils/utils");

// Login page
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // This handles the event when the enter key is pressed.
  function handleKeyDown(event) {
    // If the user presses enter, call the handle submit function
    if (event.key === "Enter") {
        handleSubmit(event);
    }
  }

  // This function is called when the submit button is pressed.
  function handleSubmit(event) {

    // Prevent the default action from firing 
    event.preventDefault();

    // If email is empty, or password is empty, or the page is currently loading, return.
    if (!email || !password || loading) {
      return;
    }
  
    // Check if the email entered during login is an email.
    if (!isEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please make sure your email is correct.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Check if the password is less then 6 characters. TODO: Turn this into a global util function.
    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Passwords must be longer then 6 characters.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Set the website state to loading as a request is made to Firebase.
    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // If user is logged in, they will be redirected to the dashboard automatically, as the state observer notices a state change.
        // This code is located in utils/useAuthHook

        // Closes all alerts that are currently open.
        toast.closeAll();
        setLoading(false)
        return;
      })
      .catch((error) => {
        // If something errors, the processErrorCode function cleans up the error code and message.
        // Then, alert the user of what went wrong.
        // TODO: Create function that sends errors.
        toast({
          title: processErrorCode(error.code),
          description: error.message,
          status: "error",
          duration: 5000,
        });

        // Set the loading state to false.
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
                Login to Studyi
              </h1>

              {/* Login Form */}

              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  name="email"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>

              <Label className={"mt-4"}>
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="password"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Label>

              {/* Login Button  */}
              <Button
                className="my-4"
                block
                onClick={handleSubmit}
                disabled={loading || !email || !password}
              >
                Log in
              </Button>

              {/* Links to other pages */}
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/create-account"
                >
                  No account? Signup here!
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
