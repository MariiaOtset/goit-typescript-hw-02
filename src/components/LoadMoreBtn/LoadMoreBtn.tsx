import css from "./LoadMoreBtn.module.css";
import { FC } from "react";
import { HandleLoadMoreClick } from "../App/App.types";

interface LoadMoreBtnProps {
  onClick: HandleLoadMoreClick;
}

const LoadMoreBtn: FC<LoadMoreBtnProps> = ({ onClick }) => {
  return (
    <button className={css.loadMoreBtn} onClick={onClick}>
      Load more
    </button>
  );
};

export default LoadMoreBtn;
