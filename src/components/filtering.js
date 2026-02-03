export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        while (elements[elementName].options.length > 1) {
          elements[elementName].remove(1);
        }

        // indexes[elementName] это объект {id: "имя"}, берем значения
        Object.values(indexes[elementName])
          .map((name) => {
            const option = document.createElement("option");
            option.value = name; // сохраняем полное имя как значение
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

    if (Object.keys(filterValues).length > 0) {
      return {
        ...query,
        filters: filterValues,
      };
    }

    return query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
