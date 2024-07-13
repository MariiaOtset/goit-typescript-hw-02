import axios, { AxiosResponse } from "axios";
import {
  UnsplashApiOptions,
  UnsplashApiResponse,
  UnsplashImage,
} from "./unsplash-api.types";

const API_KEY = "dQI8pfWZlQDgUhPFcCrAztSL_6zr-E3V3wJEujHWadA";
const BASE_URL = "https://api.unsplash.com/search/photos";

const options: UnsplashApiOptions = {
  headers: { Authorization: `Client-ID ${API_KEY}` },
};

export const fetchImages = async (
  query: string,
  page: number,
  per_page: number
): Promise<UnsplashApiResponse> => {
  const searchParams = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: "20",
  });
  const response: AxiosResponse<UnsplashApiResponse> = await axios.get(
    `${BASE_URL}?${searchParams}`,
    options
  );
  return response.data;
};
