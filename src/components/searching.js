export function initSearching(searchField) {
  return (query, state, action) => {
    return {
      ...query,
      search: state[searchField] || "",
    };
  };
}
