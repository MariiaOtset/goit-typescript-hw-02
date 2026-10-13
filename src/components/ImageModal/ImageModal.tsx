import css from "./ImageModal.module.css";
import { FC } from "react";
import ReactModal from "react-modal";
import { ModalInfo, HandleModalClose } from "../App/App.types";
import { downloadPhoto } from "../../utils/downloadPhoto";

interface ImageModalProps extends ModalInfo {
  onClose: HandleModalClose;
}

const ImageModal: FC<ImageModalProps> = ({ isOpen, url, description, onClose }) => (
  <ReactModal
    portalClassName={css.modalPortal}
    className={css.modal}
    overlayClassName={css.overlay}
    isOpen={isOpen}
    ariaHideApp={false}
    shouldCloseOnEsc={true}
    onRequestClose={onClose}
  >
    <img src={url} alt={description || "Selected photo"} className={css.modalImage} />
    <div className={css.modalActions}>
      <button type="button" onClick={() => void downloadPhoto(url, description)}>↓ Download</button>
      <button type="button" onClick={onClose} aria-label="Close image preview">✕ Close</button>
    </div>
  </ReactModal>
);
export default ImageModal;
