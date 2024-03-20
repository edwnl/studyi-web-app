import firebase from "firebase";
import React, { Component, useContext, useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Input,
  Pagination,
  Label,
  Textarea,
  WindmillContext,
} from "@windmill/react-ui";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Spinner,
  ModalBody,
  Text,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Button,
  InputGroup,
  IconButton, Tag, Link,
} from "@chakra-ui/react";
import { EditIcon, TrashIcon } from "../assets/icons";

import axios from "axios";
import { getTaskColor, titleCase } from "../utils/utils";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import * as PropTypes from "prop-types";

const resultsPerPage = 10;

// in miliseconds
const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const getRelativeTime = (d1, d2 = new Date()) => {
  if (!d1) return;

  const elapsed = d1 - d2;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units)
    if (Math.abs(elapsed) > units[u] || u === "second")
      return rtf.format(Math.round(elapsed / units[u]), u);
};

function PhoneIcon(props) {
  return null;
}

PhoneIcon.propTypes = { color: PropTypes.string };
export default function Topics() {
  const [cacheData, setCacheData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [editTask, setEditTask] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTable, setPageTable] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();
  const { mode, toggleMode } = useContext(WindmillContext);

  function search(event) {
    let currentSearchTerm = event.currentTarget.value;
    setSearchTerm(currentSearchTerm);

    if (!currentSearchTerm) {
      setDataTable(cacheData.slice(0, resultsPerPage));
    }

    let newTableData = cacheData.filter((t) =>
      t.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
    setDataTable(newTableData.slice(0, resultsPerPage));
  }

  function handleEdit(event) {
    const task_id = event.currentTarget.getAttribute("data-key");

    let findTask = cacheData.filter((t) => t.id === task_id);
    if (findTask == null) {
      toast({
        title: "Error!",
        description: "Task not found!",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setEditTask(findTask[0]);
    onOpen();
  }

  function handleClick(event) {
    const task_id = event.currentTarget.parentNode.getAttribute("data-key");

    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        setLoading(true);
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
        axios
          .delete(`${window.$apiPrefix}/todo/${task_id}`)
          .then(() => {
            toast({
              title: "Topic Deleted!",
              status: "success",
              duration: 3000,
            });

            let filteredArr = dataTable.filter((task) => task.id !== task_id);
            let filteredCachedArr = cacheData.filter(
              (task) => task.id !== task_id
            );
            setDataTable(filteredArr);
            setCacheData(filteredCachedArr);
            setLoading(false);
          })
          .catch((error) => {
            toast({
              title: "Error!",
              description: "Something went wrong. Try again later!",
              status: "error",
              duration: 3000,
            });
          });
      });
  }

  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
        axios
          .get(`${window.$apiPrefix}/todos`)
          .then((response) => {
            console.log(response.data);
            setCacheData(response.data);
            setDataTable(response.data.slice(0, resultsPerPage));
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }, []);

  function onPageChangeTable(p) {
    setPageTable(p);
    setDataTable(cacheData.slice((p - 1) * resultsPerPage, p * resultsPerPage));
  }

  return (
    <>
      <div className="flex justify-between">
        <PageTitle>Topics</PageTitle>

        <Button
            colorScheme={"green"}
            className={"mt-4"}
            onClick={(e) => history.push("/app/create")}
        >
          New Topic
        </Button>
      </div>

      <SectionTitle>All Topics</SectionTitle>

      <InputGroup className="mb-4">
        <Input
          placeholder="Search by topic name..."
          value={searchTerm}
          onChange={search}
        />
      </InputGroup>

      {loading ? (
        <Spinner />
      ) : (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader className="justify-between">
              <tr className="justify-between">
                <TableCell>Topic</TableCell>
                <TableCell>Status</TableCell>
                <TableCell className={"hidden md:table-cell"}>
                  Time Required
                </TableCell>
                <TableCell className={"hidden md:table-cell"}>Due</TableCell>
                <TableCell className={"hidden md:table-cell"}>
                  Created
                </TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {dataTable.map((task, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link onClick={handleEdit} data-key={task.id}>
                      <span className="text-sm">{task.name}</span>
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Tag
                        colorScheme={getTaskColor(task.status)}
                        size="sm">
                      {titleCase(task.status)}{" "}
                    </Tag>
                  </TableCell>

                  <TableCell className={"hidden md:table-cell"}>
                    <span className="text-sm">
                      {task.time_required + " minutes"}
                    </span>
                  </TableCell>

                  <TableCell className={"hidden md:table-cell"}>
                    <span className="text-sm">
                      {getRelativeTime(task.next_due_date)}
                    </span>
                  </TableCell>

                  <TableCell className={"hidden md:table-cell"}>
                    <span className="text-sm">
                      {getRelativeTime(task.date_created)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div
                      className="flex items-center space-x-4"
                      data-key={task.id}
                    >

                      <IconButton
                        size="xs"
                        colorScheme={mode === "dark" ? "gray.800" : "studyi"}
                        aria-label="Delete"
                        onClick={handleClick}
                        disabled={loading}
                        icon={<TrashIcon width={15} height={15} />}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={cacheData.length}
              resultsPerPage={resultsPerPage}
              onChange={onPageChangeTable}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Viewing topic</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={3}>
              {!editTask ? (
                <Text fontSize="xl">Error! Task is null.</Text>
              ) : (
                <>
                  <Text fontSize="xl">Name: {editTask.name}</Text>
                  <Text fontSize="xl">Description: {editTask.description}</Text>
                  <Text fontSize="xl">
                    Status: {titleCase(editTask.status)}
                  </Text>
                  <Text fontSize="xl">
                    Created: {getRelativeTime(editTask.date_created)}
                  </Text>
                  <Text fontSize="xl">
                    Due: {getRelativeTime(editTask.next_due_date)}
                  </Text>
                  <Text fontSize="xl">
                    Time Required: {editTask.time_required} Minutes
                  </Text>
                </>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="studyi" onClick={onClose} mr={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
