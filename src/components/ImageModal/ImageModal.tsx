import css from "./ImageModal.module.css";
import ReactModal from "react-modal";

const ImageModal = ({ isOpen, url, description, onClose }) => {
  return (
    <ReactModal
      portalClassName={css.modalPortal}
      className={css.modal}
      overlayClassName={css.overlay}
      isOpen={isOpen}
      ariaHideApp={false}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
    >
      <img src={url} alt={description} className={css.modalImage} />
    </ReactModal>
  );
};

export default ImageModal;
