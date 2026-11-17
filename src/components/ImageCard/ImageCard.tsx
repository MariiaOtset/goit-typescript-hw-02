import type {Photo} from "../../api/unsplash-api.types";
import {registerDownload} from "../../api/unsplash-api";
import {downloadPhoto} from "../../utils/downloadPhoto";
import css from "./ImageCard.module.css";
interface Props {photo:Photo;onImageClick:()=>void;isSaved:boolean;onToggleSave:(photo:Photo)=>void;}
export default function ImageCard({photo,onImageClick,isSaved,onToggleSave}:Props){
 const alt=photo.alt_description||photo.description||"Photograph by "+photo.user.name;
 const handleDownload=async()=>{await registerDownload(photo);await downloadPhoto(photo.urls.full,alt);};
 const authorUrl=photo.user.links?.html||"https://unsplash.com/@"+photo.user.username;
 return <article className={css.card} style={{backgroundColor:photo.color||"#e8e7e0"}}>
  <button className={css.preview} type="button" onClick={onImageClick} aria-label={"Open "+alt}>
   <img className={css.image} src={photo.urls.small} alt={alt} loading="lazy" decoding="async" width={photo.width} height={photo.height}/>
  </button>
  <div className={css.overlay}>
   <div className={css.topActions}><button type="button" onClick={()=>onToggleSave(photo)} title={isSaved?"Remove from saved":"Save photo"} aria-label={isSaved?"Remove photo from saved":"Save photo to collection"} aria-pressed={isSaved} className={css.save}>{isSaved?"♥":"♡"}</button></div>
   <div className={css.bottomActions}><a href={authorUrl+"?utm_source=photo_explorer&utm_medium=referral"} target="_blank" rel="noopener noreferrer" className={css.author} onClick={e=>e.stopPropagation()}>{photo.user.name}<span>ON UNSPLASH ↗</span></a><button className={css.download} type="button" title="Download photo" onClick={()=>void handleDownload()} aria-label={"Download "+alt}>↓</button></div>
  </div>
 </article>;
}
