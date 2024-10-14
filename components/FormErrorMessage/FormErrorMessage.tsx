import React from "react";
import { ErrorText } from "./style";

export const FormErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return <ErrorText>{error}</ErrorText>;
};
