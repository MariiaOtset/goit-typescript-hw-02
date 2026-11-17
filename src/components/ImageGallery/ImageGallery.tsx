import type {Photo} from "../../api/unsplash-api.types";
import ImageCard from "../ImageCard/ImageCard";
import css from "./ImageGallery.module.css";
interface Props {items:Photo[];onImageClick:(index:number)=>void;isSaved:(id:string)=>boolean;onToggleSave:(photo:Photo)=>void;}
export default function ImageGallery({items,onImageClick,isSaved,onToggleSave}:Props){return <ul className={css.gallery}>{items.map((photo,index)=><li className={css.galleryItem} key={photo.id}><ImageCard photo={photo} isSaved={isSaved(photo.id)} onToggleSave={onToggleSave} onImageClick={()=>onImageClick(index)}/></li>)}</ul>;}
