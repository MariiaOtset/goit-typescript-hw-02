export interface UnsplashApiOptions {
  headers: {
    Authorization: string;
  };
}

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
}

export interface UnsplashApiResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}
