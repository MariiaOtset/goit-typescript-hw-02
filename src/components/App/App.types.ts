export interface ModalInfo {
  isOpen: boolean;
  url: string;
  description: string;
}

export interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
}

export type HandleImageClick = ({
  url,
  description,
}: Pick<ModalInfo, "url" | "description">) => void;

export type HandleModalClose = () => void;

export type HandleLoadMoreClick = () => void;

export type HandleSearch = (newQuery: string) => void;
