import firebase from "firebase";
import React, { useEffect, useState } from "react";
import InfoCard from "../components/Cards/InfoCard";
import PageTitle from "../components/Typography/PageTitle";
import { DueIcon, TotalIcon } from "../assets/icons";
import RoundIcon from "../components/Misc/RoundIcon";
import SectionTitle from "../components/Typography/SectionTitle";
import DescriptionCard from "../components/Cards/DescriptionCard";
import axios from "axios";
import {
    Button,
} from "@chakra-ui/react"

import {useHistory} from "react-router-dom";

function l(message) {
  console.log("[REVISION] " + message);
}

export default function RevisionInProgress(props) {
  const [currentRevision, setCurrentRevision] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [pageTable, setPageTable] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("DEFAULT");
  const [revisionID, setRevisionID] = useState("");
    const [currentTask, setCurrentTask] = useState("");
    const history = useHistory();

  function handleDashboard() {
    history.push("/app/dashboard");
  }

  function handleFinishRevision(event){
      event.preventDefault();

      setLoading(true)

      axios
          .delete(`${window.$apiPrefix}/revision/${currentRevision.id}`)
          .then((response) => {
              console.log(response);
          })
          .catch((error) => {
              console.log(error);
          });

      setLoading(false)
      setStatus("PART_FINISHED");
  }

  function handleCompleteClick(event) {
    event.preventDefault();

      setLoading(true)

      let revision_tasks = currentRevision.revision_tasks;
    let pending_unfinished_task = false;
    const finished_task_id = currentTask.id;

    // Loop through tasks
    for (let i = 0; i < revision_tasks.length; i++) {
      // If the task ids match
      if (revision_tasks[i].id === finished_task_id) {
        // Set task to finished
        revision_tasks[i].finished = true;

        // Remove time left
        currentRevision.time_left -= revision_tasks[i].time_required;
        currentRevision.tasks_left -= 1;
        currentRevision.task_completed++;

        // The id of the finished task
        currentRevision.finished_task_id = finished_task_id;
        currentRevision.finished_task_status = currentTask.status;

        // Find a new task
        for (let j = 0; j < revision_tasks.length; j++) {
          if (revision_tasks[j].finished === false) {
            // There is an unfinished task
            pending_unfinished_task = true;
            setCurrentTask(revision_tasks[j]);
          }
        }

        // If there are no tasks left (i.e finished)
        if (!pending_unfinished_task) {
          currentRevision.finished = true;

          axios
            .delete(`${window.$apiPrefix}/revision/${currentRevision.id}`)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });

          setStatus("FINISHED");
        }

        axios.post(`${window.$apiPrefix}/revision/completed`, currentRevision).then((response) => {

            setLoading(false)
            if (response == null) {
            return null;
          }
        });

        // No tasks left
        break;
      }
    }
  }

  // This function is called when the page is first loaded
  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

        console.log("Revision ID: " + props.match.params.id);

        // First make a request to /revision to check for an unfinished revisions
        axios
          .get(`${window.$apiPrefix}/revision/${props.match.params.id}`)
          .then((response) => {
            if (response.data.error) {
              this.setState({
                status: "REVISION_NOT_FOUND",
              });
            }

            console.log(response.data.revisionDoc);

            setCurrentTask(response.data.revisionDoc.revision_tasks[0]);
            setCurrentRevision(response.data.revisionDoc);
            setLoading(false);
            return null;
          });
      });
  }, []);

  if (loading || !currentRevision)
    return <span className="text-lg p-5">Loading...</span>;

  if (status === "REVISION_NOT_FOUND") {
    return (
      <>
        <PageTitle>Revision not found!!</PageTitle>
        <SectionTitle>
          This task does not exist, or has been completed already.
        </SectionTitle>
        <Button onClick={handleDashboard} colorScheme={"studyi"}>Dashboard</Button>
      </>
    );
  }

    if (status === "PART_FINISHED") {
        return (
            <>
                <PageTitle>Revision ended early!</PageTitle>
                <SectionTitle>If you started the revision on a task, but didn't finish it, it won't count towards completion progress!</SectionTitle>
                <Button onClick={handleDashboard} colorScheme={"studyi"}>Dashboard</Button>
            </>
        );
    }

  if (status === "FINISHED") {
    return (
      <>
        <PageTitle>Finished!</PageTitle>
        <SectionTitle>You are all done for today. Good job!</SectionTitle>
          <Button onClick={handleDashboard} colorScheme={"studyi"}>Dashboard</Button>
      </>
    );
  }

  return (
    <>
      <PageTitle>Revision In Progress</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <InfoCard
          title="Time Left"
          value={`${currentRevision.time_left} minutes`}
        >
          <RoundIcon
            icon={DueIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Topics Left"
          value={`${currentRevision.tasks_left} Topics`}
        >
          <RoundIcon
            icon={TotalIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <SectionTitle>Current Topic</SectionTitle>

      <DescriptionCard
        className="mb-5"
        title={`${currentTask.name}`}
        value={`${currentTask.description}`}
      />

      <div className="mt-5 grid gap-6 mb-8 grid-cols-2">
        <Button
          onClick={handleCompleteClick}
          colorScheme={"green"}
          isLoading={loading}
        >
          Complete Topic
        </Button>
        <Button
            colorScheme={"red"}
            isLoading={loading}
            onClick={handleFinishRevision}
        >Finish Revision</Button>
      </div>
    </>
  );
}
