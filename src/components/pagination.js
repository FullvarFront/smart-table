import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let lastPageCount = 0;

  const updatePagination = (total, query) => {
    const pageCount = Math.ceil(total / query.rowsPerPage);
    lastPageCount = pageCount;

    const visiblePages = getPages(query.page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === query.page);
      }),
    );

    fromRow.textContent = (query.page - 1) * query.rowsPerPage + 1;
    toRow.textContent = Math.min(query.page * query.rowsPerPage, total);
    totalRows.textContent = total;
  };

  const applyPagination = (query, state, action) => {
    const rowsPerPage = state.rowsPerPage;
    let page = state.page;

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(lastPageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = lastPageCount;
          break;
      }
    }

    return {
      ...query,
      page: page,
      rowsPerPage: rowsPerPage,
    };
  };

  return { applyPagination, updatePagination };
};
