import css from "./ImageCard.module.css";
import { FC } from "react";

interface ImageCardProps {
  url: string;
  description: string;
  onImageClick: () => void;
}

const ImageCard: FC<ImageCardProps> = ({ url, description, onImageClick }) => {
  return (
    <div>
      <img
        className={css.image}
        src={url}
        alt={description}
        onClick={onImageClick}
      />
    </div>
  );
};

export default ImageCard;
