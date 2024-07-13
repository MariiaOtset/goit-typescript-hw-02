import css from "./ImageGallery.module.css";
import ImageCard from "../ImageCard/ImageCard";

const ImageGallery = ({ items, onImageClick }) => {
  return (
    <ul className={css.gallery}>
      {items.map(({ id, urls: { small, regular }, description }) => (
        <li key={id} className={css.galleryItem}>
          <ImageCard
            url={small}
            description={description}
            onImageClick={() => onImageClick({ url: regular, description })}
          />
        </li>
      ))}
    </ul>
  );
};
export default ImageGallery;
