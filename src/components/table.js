import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  if (before && before.length > 0) {
    before.forEach((templateName) => {
      root[templateName] = cloneTemplate(templateName);
      root.container.prepend(root[templateName].container);
    });
  }

  if (after && after.length > 0) {
    after.forEach((templateName) => {
      root[templateName] = cloneTemplate(templateName);
      root.container.append(root[templateName].container);
    });
  }

  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const handleClick = (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (actionBtn) {
      event.stopPropagation();
      onAction(actionBtn);
    }
  };

  root.container.addEventListener("click", handleClick);

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (row.elements && row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });

      const dataIdElement = row.container.querySelector("[data-id]");
      if (dataIdElement) {
        dataIdElement.dataset.id = item.id || item._id || "";
      }

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
