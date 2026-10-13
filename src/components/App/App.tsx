import { useState, useEffect, useRef } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ImageGallery from "../ImageGallery/ImageGallery";
import ImageModal from "../ImageModal/ImageModal";
import Loader from "../Loader/Loader";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import SearchBar from "../SearchBar/SearchBar";
import { ModalInfo, HandleImageClick } from "./App.types";
import "./App.css";
import { fetchImages } from "../../api/unsplash-api";
import { Photo } from "../../api/unsplash-api.types";

const INITIAL_MODAL_INFO: ModalInfo = {
  isOpen: false,
  url: "",
  description: "",
};

const inspirationTopics = [
  { name: "Nature", query: "landscape nature", className: "topicNature", number: "01" },
  { name: "Architecture", query: "architecture", className: "topicArchitecture", number: "02" },
  { name: "Travel", query: "travel destinations", className: "topicTravel", number: "03" },
];

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<Photo[]>([]);
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
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = (): void => {
    setSearchQuery("");
    setCurrentPage(1);
    setGalleryImages([]);
    setError(null);
    setIsLoading(false);
    setModalInfo(INITIAL_MODAL_INFO);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = (): void => setCurrentPage((prev) => prev + 1);
  const handleModalClose = (): void => setModalInfo(INITIAL_MODAL_INFO);
  const handleImageClick: HandleImageClick = ({ url = "", description = "" }) =>
    setModalInfo({ isOpen: true, url, description });

  useEffect(() => {
    if (!searchQuery) return;
    let cancelled = false;
    async function getImages(): Promise<void> {
      setIsLoading(true);
      setError(null);
      try {
        const data: Photo[] = await fetchImages(searchQuery, currentPage);
        if (cancelled) return;
        if (data.length === 0) throw new Error("No results found");
        setGalleryImages((prev) => [...prev, ...data]);
      } catch (caught) {
        if (!cancelled) setError(caught as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void getImages();
    return () => { cancelled = true; };
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (currentPage === 1 || !searchQuery) return;
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [galleryImages, currentPage, searchQuery]);

  return (
    <div ref={appRef} className="appShell">
      <SearchBar onSearch={handleSearch} onHome={handleGoHome} searchQuery={searchQuery} />
      {!searchQuery && (
        <main className="galleryIntro" aria-label="Gallery introduction">
          <div className="introCopy">
            <p className="eyebrow">PHOTO EXPLORER / UNSPLASH</p>
            <h1>Find your next <span>inspiration.</span></h1>
            <p className="introDescription">Explore beautiful photography from around the world. Search for a mood, place, or idea and discover something remarkable.</p>
            <div className="introNote"><span className="noteDot" /> A world of photography, one search away</div>
            <div className="quickSearch">
              <span>Try searching for</span>
              {["Ocean", "Mountains", "Minimalism"].map((query) => (
                <button key={query} type="button" onClick={() => handleSearch(query.toLowerCase())}>{query} <span aria-hidden="true">↗</span></button>
              ))}
            </div>
          </div>
          <div className="introShowcase" aria-hidden="true">
            <div className="showcaseBack" />
            <div className="showcaseFront" />
            <span className="showcaseCaption">COLLECT MOMENTS / FIND PERSPECTIVE</span>
          </div>
          <div className="discoverSection">
            <div className="discoverHeading">
              <div><p className="eyebrow">CURATED STARTING POINTS</p><h2>What inspires you today?</h2></div>
              <p>Choose a collection to begin, or search for anything above.</p>
            </div>
            <div className="topicGrid">
              {inspirationTopics.map((topic) => (
                <button
                  key={topic.name}
                  type="button"
                  className={`topicCard ${topic.className}`}
                  onClick={() => handleSearch(topic.query)}
                  aria-label={`Explore ${topic.name} photography`}
                >
                  <span className="topicNumber">{topic.number} / COLLECTION</span>
                  <span className="topicName">{topic.name} <span aria-hidden="true">↗</span></span>
                </button>
              ))}
            </div>
            <div className="homeFooter">
              <div><span className="footerMark" aria-hidden="true">✳</span><strong>See the world differently.</strong><span>Find a photo, open the preview, and save what inspires you.</span></div>
              <span className="footerCredit">PHOTOGRAPHY POWERED BY UNSPLASH</span>
            </div>
          </div>
        </main>
      )}
      {searchQuery && (
        <main className="galleryResults">
          <div className="resultsHeading">
            <div>
              <span className="eyebrow">SEARCH RESULTS</span>
              <h1>Results for “{searchQuery}”</h1>
              <p>Browse, preview, and download your favorite images.</p>
            </div>
            <button className="resultsHomeButton" type="button" onClick={handleGoHome}>← Back to home</button>
          </div>
          {isLoading && galleryImages.length === 0 && <Loader />}
          {galleryImages.length > 0 && (
            <>
              <ImageGallery items={galleryImages} onImageClick={handleImageClick} />
              {isLoading && <Loader />}
              {error && <ErrorMessage message={error.message} />}
              {!error && <LoadMoreBtn onClick={handleLoadMore} />}
            </>
          )}
          {error && galleryImages.length === 0 && <ErrorMessage message={error.message} />}
        </main>
      )}
      {modalInfo.isOpen && (
        <ImageModal isOpen={modalInfo.isOpen} url={modalInfo.url} description={modalInfo.description} onClose={handleModalClose} />
      )}
    </div>
  );
}

export default App;
