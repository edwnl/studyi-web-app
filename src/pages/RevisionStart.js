import firebase from "firebase";
import React, { useEffect, useState } from "react";
import InfoCard from "../components/Cards/InfoCard";
import PageTitle from "../components/Typography/PageTitle";
import { DueIcon, TotalIcon } from "../assets/icons";
import RoundIcon from "../components/Misc/RoundIcon";
import { getTaskColor, titleCase } from "../utils/utils";


import {
  Button, Spinner,
  Tag,
} from "@chakra-ui/react"

import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import SectionTitle from "../components/Typography/SectionTitle";
import axios from "axios";
import {useHistory} from "react-router-dom";

const resultsPerPage = 10;

function getEmptyRevisonDocument() {
  return {
    finish_time: -1,
    finished: true,
    start_time: Date.now(),
    task_completed: 0,
    tasks_left: 0,
    total_tasks: 0,
    tasks_skipped: 0,
    time_left: 0,
    revision_tasks: [],
  };
}

function l(message) {
  console.log("[REVISION] " + message);
}

function getNewRevisionDocument(tasks_due, total_time) {
  return {
    finish_time: -1,
    finished: false,
    start_time: Date.now(),
    task_completed: 0,
    tasks_left: tasks_due.length,
    total_tasks: tasks_due.length,
    tasks_skipped: 0,
    time_left: total_time,
    revision_tasks: tasks_due,
  };
}

// This page is for creating a new revision, or contiuning the last one.
// Homepage of revisions

export default function RevisionStart() {
  // Definition of variables. These are temporary variables.
  const [currentRevision, setCurrentRevision] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [pageTable, setPageTable] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("DEFAULT");
  const [revisionID, setRevisionID] = useState("");
  const history = useHistory();

  // This is called when the revision is started, or resumed
  function beginRevision(revisionID) {
    if (revisionID == null) return;

    // Directs the user to RevisionInProgress, which attaches the revision ID in the url.
    history.push(`/app/revise/${revisionID}`);
  }

  // Function called when the pages on the table is changed.
  function onPageChangeTable(p) {
    // Update the page
    setPageTable(p);

    // Updates the data which feeds the page.
    setDataTable(
      currentRevision.revision_tasks.slice(
        (p - 1) * resultsPerPage,
        p * resultsPerPage
      )
    );
  }

  // This is the button which starts or resumes revisions
  function handleClick(event) {
    // Prevents the default action from firing.
    event.preventDefault();
    setLoading(true)

    // If the revision does not exist yet...
    if (status === "NEW_REVISION") {
      // Make a post request which creates a new revision.
      axios
        .post(`${window.$apiPrefix}/revision/new`, currentRevision)
        .then((response) => {
          console.log(response);

          // Once the new revision is created, direct the user to RevisionInProgress.
          beginRevision(response.data);
        })
        .catch((error) => {
          // TODO: Improve error handling.
          console.log(error);
          setLoading(false)
        });
    } else {
      // The revision already exists. Just navigate to RevisionInProgress
      beginRevision(revisionID);
    }
  }

  // This function is called when the page is first loaded. "React Hook"
  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        // Obtains the current user's ID Token, and set it as the authorization header.
        // This is required so the backend server can identify the user.
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

        // First make a request to /revision to check for an unfinished revisions
        axios
          .get(`${window.$apiPrefix}/revision`)
          .then((response) => {
            // If there are no pending revisions
            if (response.data.status === "NO_PENDING_REVISION") {
              l("No pending revision found.");

              // Proceed to fetch a list of tasks
              return axios.get(`${window.$apiPrefix}/todos/due`);
            } else {
              // There are pending revisions
              l("Pending revision found:");
              console.log(response.data.revisionDoc);

              // Update the state to the found revision
              setRevisionID(response.data.revisionDoc.id);
              setCurrentRevision(response.data.revisionDoc);
              setStatus("PENDING_REVISION");
              setLoading(false);
              return null;
            }
          })
          .then((response) => {
            // If response is null, there are no pending revisions, so this request is not needed.
            // Return Null so the next .then() loop also ignores the result
            if (response == null) {
              return null;
            }
            let due_today = [];
            let total_time = 0;

            console.log(response.data);

            if (response.data.length === 0) {
              l("No due tasks.");

              setCurrentRevision(getEmptyRevisonDocument());
              setStatus("NONE_DUE");
              setLoading(false);

              return null;
            }

            l("Due tasks found.");

            response.data.forEach((item) => {
              if (Date.now() > item.next_due_date) {
                due_today.push(item);
                total_time += item.time_required;
              }
            });

            const revision_document = getNewRevisionDocument(
              due_today,
              total_time
            );

            l("Updating state. FINISHED!");

            setCurrentRevision(revision_document);
            setStatus("NEW_REVISION");
            setLoading(false);
          });
      });
    // The empty array prevents infinite loops
  }, []);

  if (loading || !currentRevision)
    return (
        <>
          <span className="text-lg p-5">Looking for your revisions...</span>
        </>
    );

  if (status === "NONE_DUE") {
    return (
      <>
        <PageTitle>Topics Due Today</PageTitle>
        <SectionTitle>Nothing due! All caught up.</SectionTitle>
      </>
    );
  }

  if (status === "FINISHED") {
    return (
      <>
        <PageTitle>Finished!</PageTitle>
        <SectionTitle>You are all done for today. Good job!</SectionTitle>
      </>
    );
  }

  return (
    <>
      <PageTitle>Revision</PageTitle>

      {status === "PENDING_REVISION" ? (
      <SectionTitle>You haven't finished your last revision!</SectionTitle>
      ) : 
      <SectionTitle>Here is a summary of what you'll study today.</SectionTitle>
      }


      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <InfoCard
          title="Estimated Time"
          value={currentRevision.time_left + " minutes"}
        >
          <RoundIcon
            icon={DueIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Topics Due" value={currentRevision.total_tasks}>
          <RoundIcon
            icon={TotalIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <Button
          isFullWidth={true} colorScheme={status === "NEW_REVISION" ? "green" : "studyi"} onClick={handleClick}
      >
        {status === "NEW_REVISION"
          ? "Start a new Revision"
          : "Continue Revision"}
      </Button>

      {status === "PENDING_REVISION" ? (
          <>
          </>
      ) : (
          <>

            <PageTitle>Topics Due Today</PageTitle>

            <TableContainer className="mb-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>Topic</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time Required</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {currentRevision.revision_tasks.map((task, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <span className="text-sm">{task.name}</span>
                        </TableCell>

                        <TableCell>
                          <Tag
                              colorScheme={getTaskColor(task.status)}
                              size="sm">
                            {titleCase(task.status)}{" "}
                          </Tag>
                        </TableCell>

                        <TableCell>
                  <span className="text-sm">
                    {task.time_required + " minutes"}
                  </span>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableFooter>
                <Pagination
                    totalResults={currentRevision.revision_tasks.length}
                    resultsPerPage={resultsPerPage}
                    onChange={onPageChangeTable}
                    label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          </>
      )}
    </>
  );
}
