import css from "./Loader.module.css";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return <InfinitySpin wrapperClass={css.spinner} />;
};

export default Loader;
