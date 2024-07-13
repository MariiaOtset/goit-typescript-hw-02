// import css from "./Loader.module.css";
import { InfinitySpin } from "react-loader-spinner";
import React from "react";

const Loader: React.FC = () => {
  return <InfinitySpin width="200" color="#4fa94d"/>;
};

export default Loader;
