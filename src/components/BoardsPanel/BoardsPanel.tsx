import {useMemo,useState} from "react";
import type {FormEvent} from "react";
import toast from "react-hot-toast";
import type {Photo} from "../../api/unsplash-api.types";
import type {Moodboard} from "../../types/moodboard";
import css from "./BoardsPanel.module.css";
interface Props {saved:Photo[];boards:Moodboard[];active:string;onSelect:(id:string)=>void;onCreate:(name:string)=>boolean;onRemove:(id:string)=>void;}
export default function BoardsPanel({saved,boards,active,onSelect,onCreate,onRemove}:Props){
 const [newName,setNewName]=useState(""),[adding,setAdding]=useState(false),[confirm,setConfirm]=useState<string|null>(null);
 const library=useMemo(()=>new Map(saved.map(photo=>[photo.id,photo])),[saved]);
 const activePhotos=active==="all"?saved:saved.filter(photo=>boards.find(b=>b.id===active)?.photoIds.includes(photo.id));
 const palette=Array.from(new Set(activePhotos.map(p=>p.color).filter((color):color is string=>!!color&&/^#[\da-f]{6}$/i.test(color)))).slice(0,6);
 const create=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();if(onCreate(newName)){setNewName("");setAdding(false);}};
 const copyColor=(hex:string)=>{if(!navigator.clipboard){toast.error("Clipboard unavailable");return;}void navigator.clipboard.writeText(hex).then(()=>toast.success("Copied "+hex)).catch(()=>toast.error("Unable to copy this colour"));};
 return <section className={css.section} aria-labelledby="boards-heading"><div className={css.head}><div><p className="pe-eyebrow">MAKE IT YOURS / PERSONAL MOODBOARDS</p><h3 className="pe-serif" id="boards-heading">Organise your <em>inspiration.</em></h3><p>Collect frames into moodboards for your next project. Everything stays in this browser.</p></div><button type="button" className={css.add} onClick={()=>setAdding(s=>!s)}>{adding?"× Close":"＋ New moodboard"}</button></div>
 {adding&&<form className={css.form} onSubmit={create}><label htmlFor="new-board-name">MOODBOARD NAME</label><div><input autoFocus id="new-board-name" maxLength={32} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. My next creative project" required/><button type="submit" disabled={newName.trim().length<2}>Create board ↗</button></div></form>}
 <div className={css.boardGrid}><button type="button" className={css.board+" "+(active==="all"?css.active:"")} onClick={()=>onSelect("all")}><div className={css.allPreview}><span>✳</span><span>ALL SAVED FRAMES</span></div><div className={css.boardCaption}><strong>Everything saved</strong><span>{saved.length} photos</span></div></button>
 {boards.map(board=>{const photos=board.photoIds.map(id=>library.get(id)).filter((photo):photo is Photo=>!!photo);return <article className={css.board+" "+(active===board.id?css.active:"")} key={board.id}><button type="button" className={css.boardSelect} onClick={()=>onSelect(board.id)} aria-pressed={active===board.id}><div className={css.preview}>{photos.length?photos.slice(0,3).map(photo=><img key={photo.id} src={photo.urls.thumb} alt=""/>):<span>✦</span>}</div><div className={css.boardCaption}><strong>{board.name}</strong><span>{photos.length} photos</span></div></button><button type="button" className={css.delete} title={"Delete board "+board.name} onClick={()=>{if(confirm===board.id){onRemove(board.id);setConfirm(null);}else setConfirm(board.id);}}>{confirm===board.id?"Confirm delete?":"Remove board"}</button></article>})}</div>
 {palette.length>0&&<div className={css.palette}><div><span>COLOUR STORY</span><small>Collected from the tones of your saved photographs. Tap to copy a hex value.</small></div><div className={css.colors}>{palette.map(hex=><button type="button" key={hex} title={"Copy "+hex} onClick={()=>copyColor(hex)} style={{backgroundColor:hex}} aria-label={"Copy colour "+hex}/>)}</div></div>}
 </section>;
}
