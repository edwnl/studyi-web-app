import firebase from "firebase";
import React, { Component} from "react";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import {
  TaskLeftIcon,
  CompletedIcon,
  DueIcon,
  TotalIcon,
} from "../assets/icons";
import RoundIcon from "../components/Misc/RoundIcon";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

const lineLegends = [
  { title: "Topics Completed (Percentage)", color: "bg-teal-600" },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph_data: {
        data: {
          labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          datasets: [
            {
              label: "Topics Completed (%)",
              backgroundColor: "#0694a2",
              borderColor: "#0694a2",
              data: [43, 48, 40, 54, 67, 73, 70],
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            x: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
            },
            y: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Value",
              },
            },
          },
        },
        legend: {
          display: false,
        },
      },
      tasks_total: 0,
      tasks_due_this_week: 0,
      tasks_completed_today: 0,
      tasks_due_today: 0,
      loading: true,
    };
  }

  componentDidMount = () => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
        axios
          .get(`${window.$apiPrefix}/todos`)
          .then((response) => {
            // Dash board items
            let tasks_total = response.data.length;
            let tasks_due_this_week = 0;
            let tasks_completed_today = 0;
            let tasks_due_today = 0;

            // Date Object
            let week_date = new Date();
            let monday_start_ms = getMonday(week_date).getTime();

            // 6.048e+8 is 168 hours in ms, minus one or else it would be the next monday
            let sunday_end_ms = monday_start_ms + 604799999;

            // Date Object
            let today_date = new Date();

            let today_ms = today_date.getTime();

            // Margin of today
            today_date.setHours(0, 0, 0, 0);
            let today_start_ms = today_date.getTime();

            today_date.setHours(23, 59, 59, 999);
            let today_end_ms = today_date.getTime();
            l("----------------------------------");
            l("Dashboard loading");

            l("monday_start_ms: " + new Date(monday_start_ms).toDateString());
            l("sunday_end_ms: " + new Date(sunday_end_ms).toDateString());
            l("today_start_ms: " + new Date(today_start_ms).toDateString());
            l("today_end_ms: " + new Date(today_end_ms).toDateString());

            // If a task is due on a day, but not finished on the day, then it is late. It is added to "total" but not "finished".
            const weekly_data = getDefaultWeeklyData(monday_start_ms);

            const status = [
              "FIRST_REVISION",
              "SECOND_REVISION",
              "THIRD_REVISION",
            ];

            console.log(response.data);

            response.data.forEach((task) => {

              /*
                  Due date
               */

              l("----------------------------------");
              l("Looping task: " + task.name);

              let due_date_ms = task.next_due_date;

              // If the task is already due...
              if(due_date_ms < today_ms){
                l("Task is already due.");

                // Increase tasks due today and this week
                tasks_due_today++;
                tasks_due_this_week++;

                l("Adding task to " + getDateFromDay(today_date.getDay()) + " 's weekly data.");

                // Add a total to the weekly data
                weekly_data[getDateFromDay(today_date.getDay())].total += 1;
                l("1")

                // If the task is not yet due
              } else {
                // If the task is due within today
                if (isToday(due_date_ms)) {
                  l("This task is due today, and is incomplete.");
                  tasks_due_today++;
                }

                // If the task is due within this week
                if (inRange(monday_start_ms, sunday_end_ms, due_date_ms)) {
                  tasks_due_this_week++;

                  let day_of_week = getDateFromDay(
                      new Date(due_date_ms).getDay()
                  );

                  l("The task due within this week, on " + day_of_week + ".");

                  weekly_data[day_of_week].total += 1;
                  l("2")
                }
              }

              for (let i = 0; i < status.length; i++) {
                // If the task has history of FIRST, SECOND or THIRD revision
                if (status[i] in task) {
                  let task_doc = task[status[i]];
                  let due_this_week = false;

                  // If the task history was due this week
                  if (inRange(monday_start_ms, sunday_end_ms, task_doc.due_date))
                    due_this_week = true;

                  // If the history was not due this week, continue
                  // Topics must be due on the week it was completed. Else, the completion is late and hence wont be recorded
                  if (!due_this_week) continue;

                  let due_day = getDateFromDay(
                    new Date(task_doc.due_date).getDay()
                  );

                  // After setting to the start of the day, check if the ms match. (same day = match)
                  // If the task was finished on the day it was due
                  l(
                    `Found ${status[i]} in the history of the task. It was due on ${due_day} this week.`
                  );

                  // Add a total task
                  weekly_data[due_day].total += 1;
                  l("3")

                  if (isTheSameDay(task_doc.due_date, task_doc.finished_ms)) {
                    l(
                      `The ${status[i]} of this task was due and finished on the same day: ${due_day}.`
                    );

                    // Add "finished" and "total" to that day (This means it is also within the current week)
                    weekly_data[due_day].finished += 1;
                  }

                  if (isToday(task_doc.finished_ms)) {
                    l(`The ${status[i]} of this task was finished today.`);

                    // Task was finished today
                    tasks_completed_today += 1;
                  }

                  if (isToday(task_doc.due_date)) {
                    l(`The ${status[i]} of this task was due today.`);

                    // Task was due today
                    tasks_due_today += 1;
                  }
                }
              }
              l("----------------------------------");
            });

            l("Finished looping tasks, setting state.");
            l("----------------------------------");

            this.setState({
              tasks_total: tasks_total,
              tasks_due_this_week: tasks_due_this_week,
              tasks_completed_today: tasks_completed_today,
              tasks_due_today: tasks_due_today,
            });

            let weekly_completion_percentage = [0, 0, 0, 0, 0, 0, 0];
            let day_index = 0;

            // This is assuming the weekly data is always from monday to sunday
            for (const day in weekly_data) {
              if (weekly_data[day].total === 0) {
                day_index++;
                continue;
              }

              console.log(day + " " + weekly_data[day].finished + " " + weekly_data[day].total)

              weekly_completion_percentage[day_index] = Math.round((weekly_data[day].finished / weekly_data[day].total) * 100)
              day_index++;
            }

            console.log("Graph Data: " + weekly_completion_percentage)

            this.setState((prevState) => {
              let graph_data = Object.assign({}, prevState.graph_data);
              graph_data.data.datasets[0].data = weekly_completion_percentage;
              return { graph_data };
            });

            this.setState({
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ errorMsg: "Error in retrieving the data." });
          });
      });
  };

  render() {
    return (
      <>
        <PageTitle>Dashboard</PageTitle>

        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="Total Topics"
            value={this.state.loading ? <Spinner /> : this.state.tasks_total}
          >
            <RoundIcon
              icon={TotalIcon}
              iconColorClass="text-purple-500 dark:text-purple-100"
              bgColorClass="bg-purple-100 dark:bg-purple-500"
              className="mr-4"
            />
          </InfoCard>

          <InfoCard
            title="Due this Week"
            value={
              this.state.loading ? <Spinner /> : this.state.tasks_due_this_week
            }
          >
            <RoundIcon
              icon={DueIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>

          <InfoCard
              title="Unfinished Today"
              value={
                this.state.loading ? (
                    <Spinner />
                ) : (
                    this.state.tasks_due_today - this.state.tasks_completed_today
                )
              }
          >
            <RoundIcon
                icon={TaskLeftIcon}
                iconColorClass="text-orange-500 dark:text-orange-100"
                bgColorClass="bg-orange-100 dark:bg-orange-500"
                className="mr-4"
            />
          </InfoCard>

          <InfoCard
            title="Completed Today"
            value={
              this.state.loading ? (
                <Spinner />
              ) : (
                this.state.tasks_completed_today
              )
            }
          >
            <RoundIcon
              icon={CompletedIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>


        </div>

        <PageTitle>Graph</PageTitle>

        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 mb-8">
            <ChartCard title="Percentage Completion Over Time">
              <Line {...this.state.graph_data} />
              <ChartLegend legends={lineLegends} />
            </ChartCard>
          </div>
        )}
      </>
    );
  }
}

function inRange(min, max, number) {
  return number >= min && number <= max;
}

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const date = new Date(d.setDate(diff));
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDefaultWeeklyData(monday_start_ms) {
  let data = {
    monday: { start: 0, finish: 0, total: 0, finished: 0 },
    tuesday: { start: 0, finish: 0, total: 0, finished: 0 },
    wednesday: { start: 0, finish: 0, total: 0, finished: 0 },
    thursday: { start: 0, finish: 0, total: 0, finished: 0 },
    friday: { start: 0, finish: 0, total: 0, finished: 0 },
    saturday: { start: 0, finish: 0, total: 0, finished: 0 },
    sunday: { start: 0, finish: 0, total: 0, finished: 0 },
  };
  let ms = monday_start_ms;

  for (const day in data) {
    data[day].start = ms;
    data[day].finish = ms + 86399999;

    ms += 86400000;
  }

  return data;
}

function getDateFromDay(day) {
  switch (day) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
    case 0:
      return "sunday";
  }
}

function l(string) {
  console.log("[DASHBOARD] " + string);
}

function isToday(ms) {
  let ms1_date = new Date(ms);
  let today = new Date();

  ms1_date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return ms1_date.getTime() === today.getTime();
}

function isTheSameDay(ms1, ms2) {
  let ms1_date = new Date(ms1);
  let ms2_date = new Date(ms2);

  ms1_date.setHours(0, 0, 0, 0);
  ms2_date.setHours(0, 0, 0, 0);

  return ms1_date.getTime() === ms2_date.getTime();
}

export default Dashboard;
