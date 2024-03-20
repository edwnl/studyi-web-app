// This is used to handle the google firebase errors. (i.e auth/incorrect-password -> Incorrect Password)
export function titleCase(str) {
  if (str == null) return str;

  str = str.replace("_", " ");
  const splitStr = str.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

// This is used to handle the google firebase errors. (i.e auth/incorrect-password -> Incorrect Password)
export function processErrorCode(errorcode) {
  errorcode = errorcode.substring(5);
  errorcode = errorcode.replace(/-/g, " ");
  return titleCase(errorcode);
}

// Returns the color for the status of a task
export function getTaskColor(taskStatus) {
  let color;

  switch (taskStatus) {
    case "FIRST_REVISION":
      color = "pink";
      break;
    case "SECOND_REVISION":
      color = "orange";
      break;
    case "THIRD_REVISION":
      color = "blue";
      break;
      default:
      color = "studyi";
  }

  return color;
}

// Check if a string is formatted as an email
export const isEmail = (email) => {
  const emailRegEx = /\S+@\S+\.\S+/;
  return !!email.match(emailRegEx);
};
