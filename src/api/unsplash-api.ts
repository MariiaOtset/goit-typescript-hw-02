import axios from "axios";
import type {Photo,PhotoFilters,SearchResults} from "./unsplash-api.types";
// Browser access keys are public. Keep the original demo key as a compatibility fallback.
const DEMO_ACCESS_KEY="dQI8pfWZlQDgUhPFcCrAztSL_6zr-E3V3wJEujHWadA";
const accessKey=import.meta.env.VITE_UNSPLASH_ACCESS_KEY||DEMO_ACCESS_KEY;
const client=axios.create({baseURL:"https://api.unsplash.com",timeout:20000,headers:{Authorization:"Client-ID "+accessKey}});
export async function searchPhotos(query:string,page=1,filters:PhotoFilters={}):Promise<SearchResults>{
 const params:Record<string,string|number>={query,page,per_page:20};
 if(filters.orientation)params.orientation=filters.orientation;
 if(filters.color)params.color=filters.color;
 const {data}=await client.get<SearchResults>("/search/photos",{params});
 return data;
}
// Compatibility with the original assignment's API contract.
export async function fetchImages(query:string,page:number):Promise<Photo[]>{return (await searchPhotos(query,page)).results;}
export async function registerDownload(photo:Photo):Promise<void>{
 const url=photo.links?.download_location;
 if(!url)return;
 try{const parsed=new URL(url);if(parsed.protocol==="https:"&&parsed.hostname==="api.unsplash.com")await client.get(url);}catch{/* Download continues if tracking request fails. */}
}
