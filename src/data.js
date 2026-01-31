import { makeIndex } from "./lib/utils.js";

const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData(sourceData) {
  const staticSellers = makeIndex(
    sourceData.sellers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const staticCustomers = makeIndex(
    sourceData.customers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const staticData = sourceData.purchase_records.map((item) => ({
    id: item.receipt_id,
    date: item.date,
    seller: staticSellers[item.seller_id],
    customer: staticCustomers[item.customer_id],
    total: item.total_amount,
  }));

  const getIndexes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/indexes`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      const sellers = makeIndex(
        data.sellers,
        "id",
        (v) => `${v.first_name} ${v.last_name}`,
      );
      const customers = makeIndex(
        data.customers,
        "id",
        (v) => `${v.first_name} ${v.last_name}`,
      );

      return { sellers, customers };
    } catch (error) {
      return { sellers: staticSellers, customers: staticCustomers };
    }
  };

  const getRecords = async (query = {}) => {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append("page", query.page);
      if (query.rowsPerPage) params.append("per_page", query.rowsPerPage);
      if (query.sort) params.append("sort", query.sort);
      if (query.search) params.append("search", query.search);

      const response = await fetch(`${BASE_URL}/records?${params.toString()}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      return {
        total: data.total,
        items: data.items,
      };
    } catch (error) {
      let result = [...staticData];

      if (query.search) {
        const search = query.search.toLowerCase();
        result = result.filter(
          (item) =>
            item.date.toLowerCase().includes(search) ||
            item.seller.toLowerCase().includes(search) ||
            item.customer.toLowerCase().includes(search),
        );
      }

      if (query.sort) {
        const [field, order] = query.sort.split(":");
        result.sort((a, b) => {
          if (order === "asc") return a[field] > b[field] ? 1 : -1;
          return a[field] < b[field] ? 1 : -1;
        });
      }

      const total = result.length;
      const page = query.page || 1;
      const rowsPerPage = query.rowsPerPage || 10;
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return {
        total,
        items: result.slice(start, end),
      };
    }
  };

  return {
    getIndexes,
    getRecords,
  };
}
