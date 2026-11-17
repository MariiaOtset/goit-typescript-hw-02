import {useEffect} from "react";
import ReactModal from "react-modal";
import type {Photo} from "../../api/unsplash-api.types";
import {registerDownload} from "../../api/unsplash-api";
import {downloadPhoto} from "../../utils/downloadPhoto";
import css from "./ImageModal.module.css";
ReactModal.setAppElement("#root");
interface Props {photo:Photo;index:number;total:number;onClose:()=>void;onNext:()=>void;onPrevious:()=>void;onToggleSave:(photo:Photo)=>void;isSaved:boolean;}
export default function ImageModal({photo,index,total,onClose,onNext,onPrevious,onToggleSave,isSaved}:Props){
 useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(event.key==="ArrowLeft")onPrevious();if(event.key==="ArrowRight")onNext();};document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey);},[onNext,onPrevious]);
 const alt=photo.alt_description||photo.description||"Photograph by "+photo.user.name;
 const download=async()=>{await registerDownload(photo);await downloadPhoto(photo.urls.full,alt);};
 const author=photo.user.links?.html||"https://unsplash.com/@"+photo.user.username;
 return <ReactModal isOpen onRequestClose={onClose} shouldCloseOnEsc shouldCloseOnOverlayClick className={css.modal} overlayClassName={css.overlay} contentLabel={"Photo by "+photo.user.name}>
  <div className={css.top}><div><span>PHOTO EXPLORER / FRAME {String(index+1).padStart(2,"0")}</span><p>{index+1} OF {total} IMAGES</p></div><button type="button" onClick={onClose} aria-label="Close photo viewer">✕</button></div>
  <div className={css.imageArea}><button type="button" className={css.arrow} aria-label="Previous image" onClick={onPrevious}>‹</button><img src={photo.urls.regular} alt={alt} className={css.image}/><button type="button" className={css.arrow} aria-label="Next image" onClick={onNext}>›</button></div>
  <div className={css.bottom}><div><strong>{alt}</strong><p>Photo by <a href={author+"?utm_source=photo_explorer&utm_medium=referral"} target="_blank" rel="noopener noreferrer">{photo.user.name} ↗</a> on Unsplash</p></div><div className={css.actions}><button type="button" onClick={()=>onToggleSave(photo)} aria-pressed={isSaved}>{isSaved?"♥ Saved":"♡ Save"}</button><button className={css.download} type="button" onClick={()=>void download()}>↓ Download</button></div></div>
 </ReactModal>;
}
