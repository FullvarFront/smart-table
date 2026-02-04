export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        while (elements[elementName].options.length > 1) {
          elements[elementName].remove(1);
        }

        Object.values(indexes[elementName])
          .map((name) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            return option;
          })
          .forEach((option) => {
            elements[elementName].append(option);
          });
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;
      if (fieldName && elements[fieldName]) {
        elements[fieldName].value = "";
      }
    }

    const filterValues = {};

    if (elements.searchBySeller && elements.searchBySeller.value) {
      filterValues["seller"] = elements.searchBySeller.value;
    }

    if (elements.searchByDate && elements.searchByDate.value) {
      filterValues["date"] = elements.searchByDate.value;
    }

    if (elements.searchByCustomer && elements.searchByCustomer.value) {
      filterValues["customer"] = elements.searchByCustomer.value;
    }

    if (elements.totalFrom && elements.totalFrom.value) {
      filterValues["total_from"] = elements.totalFrom.value;
    }

    if (elements.totalTo && elements.totalTo.value) {
      filterValues["total_to"] = elements.totalTo.value;
    }

    const filters = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        filters[`filter[${key}]`] = value;
      }
    });

    if (Object.keys(filters).length > 0) {
      return {
        ...query,
        ...filters,
      };
    }

    return query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
