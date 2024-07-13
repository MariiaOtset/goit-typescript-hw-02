import { useState, useEffect, useRef } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ImageGallery from "../ImageGallery/ImageGallery";
import ImageModal from "../ImageModal/ImageModal";
import Loader from "../Loader/Loader";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import SearchBar from "../SearchBar/SearchBar";
import { ModalInfo, ImageData, HandleImageClick } from "./App.types";
import "./App.css";
import { fetchImages } from "../../api/unsplash-api";

const INITIAL_MODAL_INFO: ModalInfo = {
  isOpen: false,
  url: "",
  description: "",
};

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalInfo, setModalInfo] = useState<ModalInfo>(INITIAL_MODAL_INFO);

  const appRef = useRef<HTMLDivElement>(null);

  const handleSearch = (newQuery: string): void => {
    if (newQuery === searchQuery) return;

    setCurrentPage(1);
    setSearchQuery(newQuery);
    setGalleryImages([]);
  };

  const handleLoadMore = (): void => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleModalClose = (): void => setModalInfo(INITIAL_MODAL_INFO);

  const handleImageClick: HandleImageClick = ({ url = "", description = "" }) =>
    setModalInfo({ isOpen: true, url, description });

  useEffect(() => {
    if (searchQuery === "") return;

    async function getImages(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchImages(searchQuery, currentPage, 20);

        if (data.results.length === 0) throw new Error("No results found");
        setGalleryImages((prev) => [...prev, ...data.results]);
      } catch (error) {
        setError(error as Error);
        throw new Error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (currentPage === 1) return;

    appRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [galleryImages, currentPage]);

  return (
    <div ref={appRef}>
      <SearchBar onSearch={handleSearch} />

      {isLoading && galleryImages.length === 0 && <Loader />}

      {galleryImages.length > 0 && (
        <>
          <ImageGallery items={galleryImages} onImageClick={handleImageClick} />

          {isLoading && <Loader />}
          {error && <ErrorMessage message={error.message} />}
          {!error && <LoadMoreBtn onClick={handleLoadMore} />}
        </>
      )}

      {error && galleryImages.length === 0 && (
        <ErrorMessage message={error.message} />
      )}

      {modalInfo.isOpen && (
        <ImageModal
          isOpen={modalInfo.isOpen}
          url={modalInfo.url}
          description={modalInfo.description}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default App;
