import axios, { AxiosResponse } from "axios";
import { FetchImages, UnsplashApiOptions } from "./unsplash-api.types";

const API_KEY = "dQI8pfWZlQDgUhPFcCrAztSL_6zr-E3V3wJEujHWadA";
const BASE_URL = "https://api.unsplash.com/search/photos";

const options: UnsplashApiOptions = {
  headers: { Authorization: `Client-ID ${API_KEY}` },
};
export const fetchImages: FetchImages = async (
  query: string,
  page: number,
) => {
  const searchParams: Record<string, any> = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: "20",
  });

  return (await axios(`${BASE_URL}?${searchParams}`, options)).data.results;
};
