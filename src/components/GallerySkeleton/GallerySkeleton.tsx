import css from "./GallerySkeleton.module.css";
export default function GallerySkeleton(){return <div className={css.grid} role="status" aria-label="Loading photography">{Array.from({length:12},(_,i)=><div key={i} className={css.tile} style={{height:190+(i%4)*65}}><div/></div>)}</div>;}
