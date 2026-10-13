import css from "./SearchBar.module.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { FC, FormEvent, useEffect, useState } from "react";
import { HandleSearch } from "../App/App.types";

interface SearchBarProps {
  onSearch: HandleSearch;
  onHome: () => void;
  searchQuery: string;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, onHome, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = inputValue.trim();
    if (!query) {
      toast.error("Please enter a search term");
      return;
    }
    onSearch(query);
  };

  const handleHome = () => {
    setInputValue("");
    onHome();
  };

  return (
    <header className={css.searchWrapper}>
      <div className={css.headerInner}>
        <button className={css.brand} type="button" onClick={handleHome} aria-label="Photo Explorer — Home">
          <span className={css.brandSymbol} aria-hidden="true">✳</span>
          <span>photo<span className={css.brandAccent}>explorer</span></span>
        </button>
        <form className={css.searchForm} onSubmit={handleSubmit} role="search">
          <div className={css.inputWrapper}>
            <input
              className={css.searchInput}
              type="search"
              name="search"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
              aria-label="Search photos"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button className={css.searchBtn} type="submit" aria-label="Search photos">
              <FaMagnifyingGlass className={css.searchIcon} />
            </button>
          </div>
        </form>
        {searchQuery && <button className={css.homeButton} type="button" onClick={handleHome}>← Home</button>}
      </div>
      <Toaster position="top-left" />
    </header>
  );
};

export default SearchBar;
