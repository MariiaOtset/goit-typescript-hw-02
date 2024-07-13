import { useState, useEffect, useRef } from "react";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import ImageModal from "./components/ImageModal/ImageModal";
import Loader from "./components/Loader/Loader";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import SearchBar from "./components/SearchBar/SearchBar";

import "./App.css";

import { fetchImages } from "./api/unsplash-api";

const INITIAL_MODAL_INFO = {
  isOpen: false,
  url: "",
  description: "",
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalInfo, setModalInfo] = useState(INITIAL_MODAL_INFO);

  const appRef = useRef();

  const handleSearch = (newQuery) => {
    if (newQuery === searchQuery) return;

    setCurrentPage(1);
    setSearchQuery(newQuery);
    setGalleryImages([]);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleModalClose = () => setModalInfo(INITIAL_MODAL_INFO);

  const handleImageClick = ({ url, description }) => {
    setModalInfo({ isOpen: true, url, description });
  };

  useEffect(() => {
    if (searchQuery === "") return;

    async function getImages() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchImages(searchQuery, currentPage);
        if (data.results.length === 0) throw new Error("No results found");
        setGalleryImages((prev) => [...prev, ...data.results]);
      } catch (error) {
        setError(error);
        throw new Error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (currentPage === 1) return;

    appRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
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
