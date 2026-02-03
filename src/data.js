const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  let sellers = {};
  let customers = {};

  const getIndexes = async () => {
    const [sellersResponse, customersResponse] = await Promise.all([
      fetch(`${BASE_URL}/sellers`),
      fetch(`${BASE_URL}/customers`),
    ]);

    const sellersData = await sellersResponse.json();
    const customersData = await customersResponse.json();

    sellers = sellersData;
    customers = customersData;

    return { sellers, customers };
  };

  const getRecords = async (query) => {
    const qs = new URLSearchParams();

    qs.append("page", query.page || 1);
    qs.append("limit", query.rowsPerPage || 10);

    if (query.search) {
      qs.append("search", query.search);
    }

    const url = `${BASE_URL}/records?${qs.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const records = await response.json();

    let items = records.items;

    if (query.sort) {
      const [field, order] = query.sort.split(":");
      items.sort((a, b) => {
        const aVal = a[field] || "";
        const bVal = b[field] || "";
        if (order === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    const resultItems = items.map((item) => {
      const sellerName = sellers[item.seller_id];
      const customerName = customers[item.customer_id];

      return {
        id: item.receipt_id,
        date: item.date,
        seller: sellerName || item.seller_id,
        customer: customerName || item.customer_id,
        total: item.total_amount,
      };
    });

    return {
      total: records.total,
      items: resultItems,
    };
  };

  return {
    getIndexes,
    getRecords,
  };
}
