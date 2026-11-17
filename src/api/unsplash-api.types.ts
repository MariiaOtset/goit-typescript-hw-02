export interface ProfileImage {small:string;medium:string;large:string}
export interface UnsplashUser {id:string;name:string;username:string;profile_image?:ProfileImage;links?:{html?:string};}
export interface UnsplashUrls {raw:string;full:string;regular:string;small:string;thumb:string;}
export interface PhotoLinks {self?:string;html:string;download?:string;download_location?:string;}
export interface Photo {
 id:string;created_at?:string;width:number;height:number;color?:string|null;blur_hash?:string|null;likes?:number;
 description:string|null;alt_description?:string|null;user:UnsplashUser;
 urls:UnsplashUrls;links:PhotoLinks;
}
export interface SearchResults {total:number;total_pages:number;results:Photo[];}
export interface PhotoFilters {orientation?:""|"landscape"|"portrait"|"squarish";color?:string;}
export type FetchImages=(query:string,page:number)=>Promise<Photo[]>;
