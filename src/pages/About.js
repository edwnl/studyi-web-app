import React from "react";

import PageTitle from "../components/Typography/PageTitle";

export default function About() {
  return (
    <>
      <PageTitle>About</PageTitle>
      <span className="text-gray-800 dark:text-gray-200">
        Studyi is a school project, aimed to help students remember and revise
        tasks following the forgetting curve.
      </span>
    </>
  );
}
