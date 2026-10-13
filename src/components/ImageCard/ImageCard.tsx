import css from "./ImageCard.module.css";
import { FC } from "react";
import { downloadPhoto } from "../../utils/downloadPhoto";

interface ImageCardProps {
  url: string;
  downloadUrl: string;
  description: string;
  onImageClick: () => void;
}

const ImageCard: FC<ImageCardProps> = ({ url, downloadUrl, description, onImageClick }) => (
  <div className={css.card}>
    <button className={css.previewButton} type="button" onClick={onImageClick} aria-label={`Preview ${description || "photo"}`}>
      <img className={css.image} src={url} alt={description || "Unsplash photo"} loading="lazy" />
    </button>
    <button className={css.downloadButton} type="button" onClick={() => void downloadPhoto(downloadUrl, description)} aria-label={`Download ${description || "photo"}`} title="Download photo">
      <span aria-hidden="true">↓</span> Download
    </button>
  </div>
);

export default ImageCard;
