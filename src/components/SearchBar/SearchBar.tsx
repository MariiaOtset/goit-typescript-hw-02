import {useEffect,useState} from "react";
import type {FormEvent} from "react";
import toast,{Toaster} from "react-hot-toast";
import css from "./SearchBar.module.css";
interface Props {onSearch:(query:string)=>void;onHome:()=>void;onSaved:()=>void;searchQuery:string;savedCount:number;view:"home"|"results"|"saved";}
export default function SearchBar({onSearch,onHome,onSaved,searchQuery,savedCount,view}:Props){
 const [input,setInput]=useState(searchQuery);
 useEffect(()=>setInput(searchQuery),[searchQuery]);
 const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const q=input.trim();if(!q){toast.error("Enter a subject, place or feeling to explore");return;}onSearch(q);};
 return <header className={css.header}><div className={css.inner}>
  <button className={css.brand} type="button" onClick={onHome} aria-label="Photo Explorer home"><span className={css.symbol} aria-hidden="true">✳</span><span className={css.brandText}>PHOTO<em>EXPLORER</em><small>THE VISUAL ARCHIVE</small></span></button>
  <nav className={css.navigation} aria-label="Main navigation"><button className={view==="home"?css.active:""} type="button" onClick={onHome}>Discover</button><button className={view==="saved"?css.active:""} type="button" onClick={onSaved}>Saved <span className={css.counter}>{savedCount}</span></button></nav>
  <form className={css.searchForm} role="search" onSubmit={submit}><label className={css.searchBox}><span aria-hidden="true" className={css.searchIcon}>⌕</span><input type="search" aria-label="Search photographs" placeholder="Search photography..." value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" aria-label="Search photos">↗</button></label></form>
 </div><Toaster position="top-center"/></header>;
}
