import css from "./ImageGallery.module.css";
import ImageCard from "../ImageCard/ImageCard";
import { FC } from "react";
import { HandleImageClick } from "../App/App.types";
import { Photo } from "../../api/unsplash-api.types";

interface ImageGalleryProps {
  items: Photo[];
  onImageClick: HandleImageClick;
}

const ImageGallery: FC<ImageGalleryProps> = ({ items, onImageClick }) => (
  <ul className={css.gallery}>
    {items.map(({ id, urls: { small, regular, full }, description }) => (
      <li key={id} className={css.galleryItem}>
        <ImageCard
          url={small}
          downloadUrl={full}
          description={description || "Photo"}
          onImageClick={() => onImageClick({ url: regular, description: description || "Photo" })}
        />
      </li>
    ))}
  </ul>
);
export default ImageGallery;
