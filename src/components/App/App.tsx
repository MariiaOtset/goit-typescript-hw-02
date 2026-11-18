import {useCallback,useEffect,useLayoutEffect,useState} from "react";
import type {Photo,PhotoFilters} from "../../api/unsplash-api.types";
import {searchPhotos} from "../../api/unsplash-api";
import SearchBar from "../SearchBar/SearchBar";
import BoardsPanel from "../BoardsPanel/BoardsPanel";
import toast from "react-hot-toast";
import type {Moodboard} from "../../types/moodboard";
import ImageGallery from "../ImageGallery/ImageGallery";
import ImageModal from "../ImageModal/ImageModal";
import GallerySkeleton from "../GallerySkeleton/GallerySkeleton";
import "./App.css";
type View="home"|"results"|"saved";
interface ModalState {items:Photo[];index:number;}
const STORAGE="photo-explorer-saved-v1",BOARDS="photo-explorer-boards-v2";
function readBoards():Moodboard[]{try{const data=JSON.parse(localStorage.getItem(BOARDS)||"[]");return Array.isArray(data)?data.filter((b:Moodboard)=>b&&typeof b.id==="string"&&typeof b.name==="string"&&Array.isArray(b.photoIds)).slice(0,16):[];}catch{return [];}}
function readSaved():Photo[]{try{const value=JSON.parse(localStorage.getItem(STORAGE)||"[]");return Array.isArray(value)?value.filter((p:Photo)=>p&&p.id&&p.urls&&p.user):[];}catch{return [];}}
const collections=[
 {number:"01",title:"Quiet architecture",type:"SPACE & STRUCTURE",query:"minimal architecture",image:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&q=85"},
 {number:"02",title:"Into the wild",type:"NATURE & LANDSCAPE",query:"wild nature landscapes",image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=85"},
 {number:"03",title:"Places to wander",type:"TRAVEL & DISCOVERY",query:"beautiful destinations",image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&q=85"},
 {number:"04",title:"The colour of calm",type:"MINIMALISM & LIGHT",query:"minimalist interiors warm light",image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&q=85"},
 {number:"05",title:"Blue hour",type:"SKY & COLOUR",query:"blue hour sea",image:"https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1000&q=85"},
 {number:"06",title:"Earth & texture",type:"NATURAL FORMS",query:"earth tones abstract texture",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=85"}
];
const orientations=[{value:"",name:"Any orientation"},{value:"landscape",name:"Landscape"},{value:"portrait",name:"Portrait"},{value:"squarish",name:"Square"}] as const;
const colors=[{value:"",name:"All colours"},{value:"black_and_white",name:"Black & white"},{value:"black",name:"Black"},{value:"white",name:"White"},{value:"yellow",name:"Yellow"},{value:"orange",name:"Orange"},{value:"red",name:"Red"},{value:"purple",name:"Purple"},{value:"green",name:"Green"},{value:"teal",name:"Teal"},{value:"blue",name:"Blue"}];
export default function App(){
 const [view,setView]=useState<View>("home"),[query,setQuery]=useState(""),[filters,setFilters]=useState<PhotoFilters>({orientation:"",color:""});
 const [page,setPage]=useState(1),[items,setItems]=useState<Photo[]>([]),[totalPages,setTotalPages]=useState(1),[total,setTotal]=useState(0);
 const [loading,setLoading]=useState(false),[error,setError]=useState<string|null>(null),[requestId,setRequestId]=useState(0);
 const [saved,setSaved]=useState<Photo[]>(readSaved),[modal,setModal]=useState<ModalState|null>(null);
 const [boards,setBoards]=useState<Moodboard[]>(readBoards),[activeBoard,setActiveBoard]=useState("all");
 const [navigationId,setNavigationId]=useState(0);
 // Photo Explorer swaps views without React Router. Reset before paint when
 // switching views or starting a new search, but not for filters/load-more.
 useLayoutEffect(()=>{
  const root=document.documentElement;
  const previous=root.style.scrollBehavior;
  root.style.scrollBehavior="auto";
  window.scrollTo(0,0);
  root.style.scrollBehavior=previous;
 },[view,navigationId]);
 useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{/* Browser storage might be unavailable. */}},[saved]);
 useEffect(()=>{try{localStorage.setItem(BOARDS,JSON.stringify(boards));}catch{/* Browser storage might be unavailable. */}},[boards]);
 useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key===STORAGE)setSaved(readSaved());if(event.key===BOARDS)setBoards(readBoards());};window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync);},[]);
 const startSearch=useCallback((value:string)=>{const next=value.trim();if(!next)return;setQuery(next);setFilters({orientation:"",color:""});setItems([]);setTotalPages(1);setTotal(0);setPage(1);setRequestId(x=>x+1);setError(null);setView("results");setNavigationId(n=>n+1);},[]);
 const goHome=()=>{setModal(null);setView("home");setQuery("");setNavigationId(n=>n+1);};
 const goSaved=()=>{setModal(null);setView("saved");setNavigationId(n=>n+1);};
 const updateFilters=(key:keyof PhotoFilters,value:string)=>{setFilters(prev=>({...prev,[key]:value}));setItems([]);setTotalPages(1);setPage(1);setError(null);};
 useEffect(()=>{if(view!=="results"||!query)return;let alive=true;setLoading(true);setError(null);
  searchPhotos(query,page,filters).then(data=>{if(!alive)return;
   setItems(prev=>page===1?data.results:[...prev,...data.results].filter((p,i,arr)=>arr.findIndex(x=>x.id===p.id)===i));
   setTotal(data.total);setTotalPages(Math.max(1,data.total_pages));
  }).catch(err=>{if(alive)setError(err?.response?.status===403||err?.response?.status===429?"The photography API is temporarily rate-limited. Please try again later.":"We could not load the photos. Check your connection and try again.");}).finally(()=>{if(alive)setLoading(false);});
  return()=>{alive=false;};
 },[view,query,page,filters.orientation,filters.color,requestId]);
 const toggleSave=(photo:Photo)=>{
  const removing=saved.some(item=>item.id===photo.id);
  setSaved(prev=>prev.some(item=>item.id===photo.id)?prev.filter(item=>item.id!==photo.id):[...prev,photo]);
  if(removing)setBoards(prev=>prev.map(board=>({...board,photoIds:board.photoIds.filter(id=>id!==photo.id)})));
 };
 const createBoard=(name:string):boolean=>{
  const value=name.trim().replace(/\s+/g," ");
  if(value.length<2||value.length>32){toast.error("Use a name between 2 and 32 characters.");return false;}
  if(boards.some(board=>board.name.toLowerCase()===value.toLowerCase())){toast.error("You already have a board with that name.");return false;}
  if(boards.length>=12){toast.error("You can create up to 12 moodboards.");return false;}
  const id="board-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
  setBoards(prev=>[...prev,{id,name:value,photoIds:[]}]);setActiveBoard(id);toast.success("Moodboard created");return true;
 };
 const removeBoard=(id:string)=>{setBoards(prev=>prev.filter(board=>board.id!==id));setActiveBoard("all");toast.success("Moodboard deleted; photos remain saved.");};
 const toggleBoardPhoto=(photo:Photo,id:string)=>{
  if(!boards.some(board=>board.id===id))return;
  setBoards(prev=>prev.map(board=>board.id!==id?board:{...board,photoIds:board.photoIds.includes(photo.id)?board.photoIds.filter(photoId=>photoId!==photo.id):[...board.photoIds,photo.id]}));
  if(!saved.some(item=>item.id===photo.id))setSaved(prev=>[...prev,photo]);
 };
 const isSaved=(id:string)=>saved.some(photo=>photo.id===id);
 const gallery=view==="saved"?(activeBoard==="all"?saved:saved.filter(photo=>boards.find(b=>b.id===activeBoard)?.photoIds.includes(photo.id))):items;
 const openModal=(index:number)=>setModal({items:[...gallery],index});
 const next=useCallback(()=>setModal(prev=>prev?{...prev,index:(prev.index+1)%prev.items.length}:prev),[]);
 const previous=useCallback(()=>setModal(prev=>prev?{...prev,index:(prev.index+prev.items.length-1)%prev.items.length}:prev),[]);
 const selected=modal?.items[modal.index];
 return <div className="appShell">
  <SearchBar onSearch={startSearch} onHome={goHome} onSaved={goSaved} searchQuery={query} savedCount={saved.length} view={view}/>
  {view==="home"&&<main>
   <section className="pe-hero"><div className="pe-container pe-hero-grid"><div className="pe-hero-copy"><p className="pe-eyebrow">THE ART OF SEEING / ISSUE Nº 01</p><h1 className="pe-serif">Find your <em>point of view.</em></h1><p>Some images make you look twice. Others make you feel something. Explore a world of photography made for curious eyes and creative minds.</p><div className="pe-hero-actions"><button type="button" className="pe-button" onClick={()=>startSearch("editorial photography")}>Explore photography <span aria-hidden="true">↗</span></button><button type="button" className="pe-surprise" onClick={()=>{const terms=["sunlit architecture","film photography coast","earthy abstract textures","ocean at dusk","minimal floral still life","mountain photography"];startSearch(terms[Math.floor(Math.random()*terms.length)]);}}>Surprise me ✳</button><span>CURATED INSPIRATION, ONE FRAME AT A TIME</span></div><div className="pe-hero-footer"><span>01 / THE VISUAL ARCHIVE</span><span>SCROLL TO DISCOVER ↓</span></div></div><div className="pe-hero-visual"><div className="pe-hero-main"><img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&q=90" alt="Alpine lake framed by mountains and a small wooden cabin" /><span>THE BEAUTY OF GETTING LOST</span></div><div className="pe-hero-overlap"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700&q=85" alt="Natural light falling across a minimalist architectural interior"/></div><div className="pe-image-stamp">LOOK CLOSER<br/>FEEL MORE<br/>✳</div></div></div></section>
   <section className="pe-intro pe-container"><div><p className="pe-eyebrow">WELCOME TO PHOTO EXPLORER</p><h2 className="pe-serif">A little more <em>wonder.</em> A little less noise.</h2></div><p>Not just a search bar. A place to collect perspectives, colours, places and the tiny details that make an image unforgettable. Discover something new, or save a moment for later.</p></section>
   <section className="pe-collections pe-container" aria-labelledby="collection-title"><div className="pe-section-header"><div><p className="pe-eyebrow">CURATED STARTING POINTS / 001—006</p><h2 id="collection-title" className="pe-serif">Follow your <em>curiosity.</em></h2></div><p>Pick a visual world to explore, or search for an idea of your own.</p></div><div className="pe-collection-grid">{collections.map(c=><button type="button" key={c.number} className="pe-collection-card" onClick={()=>startSearch(c.query)} style={{backgroundImage:'linear-gradient(180deg,#07181230 0%,#071812b5 100%),url("'+c.image+'")'}}><span>{c.number} / {c.type}</span><strong className="pe-serif">{c.title}</strong><span className="pe-collection-arrow" aria-hidden="true">↗</span></button>)}</div></section>
   <section className="pe-color-studies pe-container"><div><p className="pe-eyebrow">COLOUR NOTES / A NEW WAY TO DISCOVER</p><h2 className="pe-serif">Start with a <em>colour.</em></h2><p>Sometimes all it takes is a shade to find your next idea.</p></div><div className="pe-color-grid">{[{hex:"#A7B8AA",label:"Sage",query:"sage green interiors"},{hex:"#D9B59E",label:"Clay",query:"terracotta minimal architecture"},{hex:"#8299AC",label:"Haze",query:"soft blue landscape"},{hex:"#D5C5A3",label:"Sand",query:"sandy desert photography"},{hex:"#72716A",label:"Stone",query:"stone grey still life"}].map(c=><button type="button" key={c.hex} onClick={()=>startSearch(c.query)}><span style={{backgroundColor:c.hex}}/><strong>{c.label}</strong><small>{c.hex}</small></button>)}</div></section>
   <section className="pe-editorial"><div className="pe-editorial-photo" role="img" aria-label="Wild nature landscape"/><div className="pe-editorial-content"><p className="pe-eyebrow">THE INSPIRATION EDIT</p><h2 className="pe-serif">Every frame<br/>tells <em>a story.</em></h2><p>For the creative minds, slow wanderers and people who notice the light. Start with a feeling and see where it takes you.</p><button className="pe-button" onClick={()=>startSearch("natural light photography")}>Find your next inspiration ↗</button></div></section>
   <section className="pe-note pe-container"><div><p className="pe-eyebrow">SAVE WHAT MOVES YOU</p><h2 className="pe-serif">A collection that feels <em>like you.</em></h2></div><div><p>Keep favourite frames close in a personal collection stored right here in your browser. No account, no clutter — just inspiration worth returning to.</p><button className="pe-text-link" type="button" onClick={goSaved}>Open saved photos ↗</button></div></section>
  </main>}
  {view==="results"&&<main className="pe-results pe-container">
   <div className="pe-page-intro"><p className="pe-eyebrow">THE VISUAL ARCHIVE / SEARCH</p><h1 className="pe-serif">Results for <em>“{query}”</em></h1><p>Find your next favourite frame. Open, save, download, or follow the artist back to Unsplash.</p></div>
   <div className="pe-toolbar"><div><p className="pe-eyebrow">{loading&&items.length===0?"DISCOVERING PHOTOS":total.toLocaleString("en-GB")+" RESULTS"}</p><h2 className="pe-serif">Explore the collection.</h2></div><div className="pe-filter-controls"><label>ORIENTATION <select aria-label="Filter photo orientation" value={filters.orientation||""} onChange={e=>updateFilters("orientation",e.target.value)}>{orientations.map(o=><option value={o.value} key={o.value}>{o.name}</option>)}</select></label><label>COLOUR <select aria-label="Filter photo colour" value={filters.color||""} onChange={e=>updateFilters("color",e.target.value)}>{colors.map(c=><option key={c.value} value={c.value}>{c.name}</option>)}</select></label><button className="pe-reset" type="button" onClick={()=>{setFilters({orientation:"",color:""});setItems([]);setPage(1);setRequestId(n=>n+1);}}>Reset filters ↺</button></div></div>
   {loading&&items.length===0&&<GallerySkeleton/>}
   {error&&<div className="pe-message pe-message-error"><h3>Something interrupted the search.</h3><p>{error}</p><button type="button" className="pe-button" onClick={()=>{setError(null);setRequestId(n=>n+1);}}>Try again ↗</button></div>}
   {items.length>0&&<ImageGallery items={items} isSaved={isSaved} onToggleSave={toggleSave} onImageClick={openModal}/>}
   {!loading&&!error&&items.length===0&&<div className="pe-message"><span aria-hidden="true">✳</span><h3>No photos found this time.</h3><p>Try a broader search, or change the colour and orientation filters.</p><button type="button" className="pe-button" onClick={()=>startSearch("landscape")}>Explore landscapes ↗</button></div>}
   {loading&&items.length>0&&<div className="pe-more-note">Discovering more photographs…</div>}
   {!loading&&!error&&items.length>0&&page<totalPages&&<div className="pe-load-more"><button className="pe-button" onClick={()=>setPage(n=>n+1)} type="button">Load more photographs <span aria-hidden="true">↓</span></button></div>}
   {!loading&&!error&&items.length>0&&page>=totalPages&&<div className="pe-end-note">YOU&apos;VE REACHED THE END OF THIS COLLECTION · START A NEW SEARCH TO KEEP EXPLORING</div>}
  </main>}
  {view==="saved"&&<main className="pe-saved pe-container"><div className="pe-page-intro"><p className="pe-eyebrow">YOUR PERSONAL COLLECTION / SAVED</p><h1 className="pe-serif">The images you <em>keep.</em></h1><p>Collected by you, stored on this device. A little space for the photographs that make you pause.</p></div><div className="pe-toolbar"><div><p className="pe-eyebrow">{saved.length} SAVED {saved.length===1?"FRAME":"FRAMES"}</p><h2 className="pe-serif">Your visual archive.</h2></div><button className="pe-text-link" onClick={goHome}>Discover more ↗</button></div><BoardsPanel saved={saved} boards={boards} active={activeBoard} onSelect={setActiveBoard} onCreate={createBoard} onRemove={removeBoard}/>{gallery.length>0?<ImageGallery items={gallery} isSaved={isSaved} onToggleSave={toggleSave} onImageClick={openModal}/>:<div className="pe-message"><span aria-hidden="true">♡</span><h3>{activeBoard==="all"?"Your collection starts with a feeling.":"An empty board, full of possibility."}</h3><p>{activeBoard==="all"?"Save photographs that catch your eye and they will be waiting here when you return.":"Open any saved photograph and choose this moodboard in the image viewer to add it here."}</p><button className="pe-button" type="button" onClick={activeBoard==="all"?goHome:()=>setActiveBoard("all")}>{activeBoard==="all"?"Find your inspiration ↗":"Browse all saved photos ↗"}</button></div>}</main>}
  <footer className="pe-footer"><div className="pe-container pe-footer-top"><div><h2 className="pe-serif">Keep looking. <em>Keep wondering.</em></h2><p>The world is full of moments worth noticing.</p></div><button type="button" className="pe-button" onClick={goHome}>Back to discover ↗</button></div><div className="pe-container pe-footer-bottom"><strong>✳ PHOTO EXPLORER</strong><span>Photography powered by <a href="https://unsplash.com/?utm_source=photo_explorer&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash ↗</a></span><span>© {new Date().getFullYear()}</span></div></footer>
  {modal&&selected&&<ImageModal photo={selected} index={modal.index} total={modal.items.length} onClose={()=>setModal(null)} onNext={next} onPrevious={previous} isSaved={isSaved(selected.id)} onToggleSave={toggleSave} boards={boards} onToggleBoard={toggleBoardPhoto}/>}
 </div>;
}
