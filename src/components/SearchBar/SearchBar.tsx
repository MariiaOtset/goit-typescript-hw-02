import css from "./SearchBar.module.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

const SearchBar = ({ onSearch }) => {
  const notify = () => toast.error("Please enter the text for images search");

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.currentTarget.elements.search.value.trim();

    if (searchQuery === "") {
      notify();
      return;
    }
    onSearch(searchQuery);
  };

  return (
    <>
      <header className={css.searchWrapper}>
        <form className={css.searchForm} onSubmit={handleSubmit}>
          <div className={css.inputWrapper}>
            <button className={css.searchBtn} type="submit">
              <FaMagnifyingGlass className={css.searchIcon} />
            </button>
            <input
              className={css.searchInput}
              type="text"
              name="search"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
            />
          </div>
          <Toaster position="top-left" />
        </form>
      </header>
    </>
  );
};

export default SearchBar;
