import React from "react";
import { Card, CardBody } from "@windmill/react-ui";

function DescriptionCard({ title, value, children: icon }) {
  return (
    <Card>
      <CardBody className="flex items-center">
        {icon}
        <div>
          <p className="mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
            {title}
          </p>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default DescriptionCard;
