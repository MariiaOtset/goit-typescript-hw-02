import React, { FC } from "react";
// import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return <p>{message}</p>;
};

export default ErrorMessage;
