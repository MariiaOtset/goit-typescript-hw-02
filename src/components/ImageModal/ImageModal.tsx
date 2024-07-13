import css from "./ImageModal.module.css";
import { FC } from "react";
import ReactModal from "react-modal";
import { ModalInfo, HandleModalClose } from "../App/App.types";

interface ImageModalProps extends ModalInfo {
  onClose: HandleModalClose;
}

const ImageModal: FC<ImageModalProps> = ({
  isOpen,
  url,
  description,
  onClose,
}) => {
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
