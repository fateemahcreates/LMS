function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search students..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;