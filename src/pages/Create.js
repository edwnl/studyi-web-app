import React, { useState } from "react";
import firebase from "firebase";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Textarea } from "@windmill/react-ui";

import { Link } from "react-router-dom";
import axios from "axios";
import { Box, useToast } from "@chakra-ui/react";

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
    Button
} from "@chakra-ui/react";
import {Subheading} from "../components/Misc/Headings";
import SectionTitle from "../components/Typography/SectionTitle";

export default function Create() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeRequired, setTimeRequired] = useState(5);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // This handles the event when the enter key is pressed.
  function handleKeyDown(event) {
    // If the user presses enter, call the handle submit function
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || !description) {
      return;
    }

    if(name.length > 500 || description.length > 1000){
        toast({
          title: "Error!",
          description: `Name or Description must not exceed 1000 characters.`,
          status: "error",
          duration: 5000,
        });
        return;
    }

    setLoading(true)

    // Potential Risk to exploit with request intercepter
    const newTodoItem = {
      name: name,
      description: description,
      time_required: timeRequired,
      next_due_date: Date.now() + 8.64e7,
      date_created: Date.now(),
      status: "FIRST_REVISION",
    };

    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
        axios
          .post(`${window.$apiPrefix}/todo`, newTodoItem)
          .then(() => {
            toast({
              title: "Success!",
              description: `${name} has been created. The first revision will be due in 24 hours!`,
              status: "success",
              duration: 5000,
            });
            setName("");
            setDescription("");
            setLoading(false)

          })
          .catch(() => {
            toast({
              title: "Error!",
              description: `Something went wrong. Try again later!`,
              status: "error",
              duration: 5000,
            });
            setName("");
            setDescription("");
            setLoading(false)

          });
      });
  }

  return (
    <>
      <PageTitle>Create A New Topic</PageTitle>
      <SectionTitle>Learnt something new today? Record the topic to revise later.</SectionTitle>

      <div className="px-4 py-4 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Topic</span>
          <Input
            name="name"
            value={name}
            className="mt-2"
            onKeyDown={handleKeyDown}
            placeholder="Algebra"
            onChange={(e) => setName(e.target.value)}
          />
        </Label>

        <Label className="mt-4">
          <span>Topic Description</span>
          <Textarea
            className="mt-2"
            name="description"
            onKeyDown={handleKeyDown}
            rows="3"
            value={description}
            placeholder="Notes found in page 33 of textbook"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>

        <Label className="mt-4">
          <span>Topic Revision Length: {timeRequired} minutes</span>

          <Slider
            defaultValue={5}
            min={5}
            max={60}
            step={5}
            onChange={(value) => setTimeRequired(value)}
          >
            <SliderTrack bg={"studyi.300"}>
              <Box position="relative" right={10} />
              <SliderFilledTrack bg={"studyi.500"} />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Label>

        <Button
          className="mt-6"
          block
          isLoading={loading}
          loadingText={"Creating Topic..."}
          colorScheme={"studyi"}
          isFullWidth={true}
          onClick={handleSubmit}
          disabled={!name || !description || loading}
        >
          Create
        </Button>
      </div>
    </>
  );
}
