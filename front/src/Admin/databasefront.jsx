import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Save,
  Search,
  ShoppingCart,
  Package,
  Tag,
  Trash2,
  Plus,
  Minus,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  X,
  Receipt,
  History,
  Calculator,
  FileSpreadsheet,
} from "lucide-react";

const API_PRODUCTS = "http://localhost:5000/api/productsection";
const API_SALES = "http://localhost:5000/api/sales";
const API_ACCOUNTING = "http://localhost:5000/api/accounting";

const currencyOptions = ["AFN", "USD", "PLN"];

const today = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const money = (value, currency) =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  }).format(Number(value) || 0)} ${currency}`;

const productId = (p) => p?._id || p?.id || p?.productId || "";

const productName = (p) =>
  p?.name || p?.title || p?.productName || "Unnamed product";

const sellingPrice = (p) => Number(p?.price ?? p?.sellingPrice ?? 0);

const purchasePrice = (p) =>
  Number(p?.purchasePrice ?? p?.buyPrice ?? p?.costPrice ?? 0);

const productImage = (p) => p?.image || p?.imageUrl || p?.photo || "";

function getProductArray(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.products)) return data.products;

  if (Array.isArray(data?.product)) return data.product;

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

const navigation = [
  { id: "sale", label: "New Sale", icon: ShoppingCart },

  { id: "products", label: "Products", icon: Package },

  { id: "reports", label: "Sales Reports", icon: History },

  { id: "accounting", label: "Accounting", icon: FileSpreadsheet },
];

function Field({ label, value, onChange, type = "text", min }) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>

      <input
        type={type}
        min={min}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function StatCard({ title, value, icon: Icon, tone = "sky" }) {
  const tones = {
    sky: "bg-sky-50 text-sky-600",

    purple: "bg-violet-50 text-violet-600",

    amber: "bg-amber-50 text-amber-600",

    green: "bg-emerald-50 text-emerald-600",

    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-3 break-words text-xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${tones[tone] || tones.sky}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ label, value, strong = false, color = "" }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span
        className={
          strong ? "font-bold text-slate-800" : "text-sm text-slate-500"
        }
      >
        {label}
      </span>

      <span
        className={`${strong ? "text-lg font-bold" : "font-semibold"} ${color}`}
      >
        {value}
      </span>
    </div>
  );
}

function AccountingSection({ currency, setCurrency }) {
  const [tables, setTables] = useState([]);

  const [selectedId, setSelectedId] = useState("");

  const [rows, setRows] = useState([]);

  const [tableName, setTableName] = useState("");

  const [tableDate, setTableDate] = useState(today());

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [savingId, setSavingId] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const blankRow = (id = selectedId) => ({
    _id: `new-${Date.now()}-${Math.random()}`,

    tableId: id,

    tableName:
      tables.find((table) => table.tableId === id)?.tableName || tableName,

    date: tableDate,

    productName: "",

    quantityPurchased: 0,

    quantitySold: 0,

    purchasePrice: 0,

    sellingPrice: 0,

    shippingCost: 0,

    otherCosts: 0,

    discountType: "amount",

    discountValue: 0,

    currency,

    notes: "",
  });

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  };

  const loadTables = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const params = new URLSearchParams({ currency, search });

      const data = await request(
        `${API_ACCOUNTING}/tables?${params.toString()}`,
      );

      setTables(data.tables || []);

      setSelectedId((oldId) => {
        if ((data.tables || []).some((t) => t.tableId === oldId)) {
          return oldId;
        }

        return "";
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currency, search]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const loadRows = useCallback(async () => {
    if (!selectedId) {
      setRows([]);

      return;
    }

    setLoading(true);

    try {
      const data = await request(
        `${API_ACCOUNTING}/tables/${encodeURIComponent(selectedId)}`,
      );

      setRows(data.rows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const selectedTable = tables.find((table) => table.tableId === selectedId);

  const createTable = async () => {
    if (!tableName.trim()) {
      setError("Enter a name for the table.");

      return;
    }

    if (!tableDate) {
      setError("Choose a date.");

      return;
    }

    setError("");

    setMessage("");

    try {
      const data = await request(`${API_ACCOUNTING}/tables`, {
        method: "POST",

        body: JSON.stringify({
          tableName: tableName.trim(),

          date: tableDate,

          currency,
        }),
      });

      const table = data.table;

      setTables((old) => [
        {
          ...table,

          rows: [],
        },

        ...old.filter((item) => item.tableId !== table.tableId),
      ]);

      setSelectedId(table.tableId);

      setTableName("");

      setMessage(`Table "${table.tableName}" created.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCell = (id, field, value) => {
    setRows((old) =>
      old.map((row) => (row._id === id ? { ...row, [field]: value } : row)),
    );
  };

  const calculate = (row) => {
    const purchased = Number(row.quantityPurchased) || 0;

    const sold = Number(row.quantitySold) || 0;

    const buy = Number(row.purchasePrice) || 0;

    const sell = Number(row.sellingPrice) || 0;

    const shipping = Number(row.shippingCost) || 0;

    const other = Number(row.otherCosts) || 0;

    const gross = sold * sell;

    const rawDiscount =
      row.discountType === "percent"
        ? (gross * Math.min(100, Number(row.discountValue) || 0)) / 100
        : Number(row.discountValue) || 0;

    const discount = Math.min(gross, Math.max(0, rawDiscount));

    const revenue = gross - discount;

    const costs = sold * buy + shipping + other;

    return {
      investment: purchased * buy,

      gross,

      discount,

      revenue,

      costs,

      profit: revenue - costs,

      remaining: purchased - sold,

      stockValue: Math.max(0, purchased - sold) * buy,
    };
  };

  const totals = useMemo(
    () =>
      rows.reduce(
        (sum, row) => {
          const result = calculate(row);

          sum.investment += result.investment;

          sum.revenue += result.revenue;

          sum.costs += result.costs;

          sum.profit += result.profit;

          sum.remaining += result.remaining;

          sum.stockValue += result.stockValue;

          return sum;
        },

        {
          investment: 0,

          revenue: 0,

          costs: 0,

          profit: 0,

          remaining: 0,

          stockValue: 0,
        },
      ),

    [rows],
  );

  const allTotals = useMemo(
    () =>
      tables.reduce(
        (sum, table) => {
          for (const row of table.rows || []) {
            const result = calculate(row);

            sum.investment += result.investment;

            sum.revenue += result.revenue;

            sum.costs += result.costs;

            sum.profit += result.profit;

            sum.remaining += result.remaining;
          }

          return sum;
        },

        { investment: 0, revenue: 0, costs: 0, profit: 0, remaining: 0 },
      ),

    [tables],
  );

  const saveRow = async (row) => {
    if (!selectedId) return setError("Select a table first.");

    if (!row.date || !row.productName.trim()) {
      return setError("Date and product name are required.");
    }

    const purchased = Number(row.quantityPurchased) || 0;

    const sold = Number(row.quantitySold) || 0;

    if (purchased < 0 || sold < 0 || sold > purchased) {
      return setError(
        "Quantities must be valid; sold quantity cannot exceed bought quantity.",
      );
    }

    const numericFields = [
      "purchasePrice",

      "sellingPrice",

      "shippingCost",

      "otherCosts",

      "discountValue",
    ];

    if (
      numericFields.some(
        (field) =>
          !Number.isFinite(Number(row[field])) || Number(row[field]) < 0,
      )
    ) {
      return setError("Prices, costs, and discount must be non-negative.");
    }

    if (row.discountType === "percent" && Number(row.discountValue) > 100) {
      return setError("Discount percentage cannot exceed 100%.");
    }

    setSavingId(row._id);

    setError("");

    setMessage("");

    const payload = {
      tableId: selectedId,

      tableName: selectedTable?.tableName || row.tableName || "",

      date: row.date,

      productName: row.productName.trim(),

      quantityPurchased: purchased,

      quantitySold: sold,

      purchasePrice: Number(row.purchasePrice) || 0,

      sellingPrice: Number(row.sellingPrice) || 0,

      shippingCost: Number(row.shippingCost) || 0,

      otherCosts: Number(row.otherCosts) || 0,

      discountType: row.discountType || "amount",

      discountValue: Number(row.discountValue) || 0,

      currency,

      notes: row.notes || "",
    };

    const isNew = String(row._id).startsWith("new-");

    try {
      await request(isNew ? API_ACCOUNTING : `${API_ACCOUNTING}/${row._id}`, {
        method: isNew ? "POST" : "PUT",

        body: JSON.stringify(payload),
      });

      setMessage("Record saved successfully.");

      await loadRows();

      await loadTables();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId("");
    }
  };

  const deleteRow = async (row) => {
    if (String(row._id).startsWith("new-")) {
      setRows((old) => old.filter((item) => item._id !== row._id));

      return;
    }

    if (!window.confirm("Delete this product row?")) return;

    try {
      await request(`${API_ACCOUNTING}/${row._id}`, {
        method: "DELETE",
      });

      setMessage("Product row deleted.");

      await loadRows();

      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTable = async () => {
    if (!selectedTable) return;

    if (
      !window.confirm(
        `Delete "${selectedTable.tableName}" and all its saved rows? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await request(
        `${API_ACCOUNTING}/tables/${encodeURIComponent(selectedId)}`,

        { method: "DELETE" },
      );

      setSelectedId("");

      setRows([]);

      setMessage("Table deleted.");

      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const summaryCards = [
    ["Money invested", totals.investment],

    ["Sales revenue", totals.revenue],

    ["Total costs", totals.costs],

    ["Profit / loss", totals.profit],

    ["Stock remaining", totals.remaining],

    ["Remaining stock value", totals.stockValue],
  ];

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-700 bg-[#101312] p-5 text-white shadow-xl">
        <h3 className="text-xl font-bold text-green-400">Accounting Tables</h3>

        <p className="mt-1 text-sm text-slate-400">
          Create separate named tables. Each table stores its own products.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Table name, e.g. October Stock"
            className="min-w-0 rounded-lg border border-slate-600 bg-[#191e1b] px-3 py-3 text-white"
          />

          <input
            type="date"
            value={tableDate}
            onChange={(e) => setTableDate(e.target.value)}
            className="rounded-lg border border-slate-600 bg-[#191e1b] px-3 py-3 text-white"
          />

          <button
            onClick={createTable}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-bold hover:bg-green-500"
          >
            <Plus size={17} /> Create Table
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_auto]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table name, date, or product..."
              className="w-full rounded-lg border border-slate-600 bg-[#191e1b] py-3 pl-10 pr-3 text-white"
            />
          </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-slate-600 bg-[#191e1b] px-3 py-3 text-white"
          >
            {currencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={loadTables}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-4 py-3 hover:bg-slate-800"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950 p-4 text-sm text-red-300">
          {error}

          <button onClick={() => setError("")} className="ml-3 underline">
            Dismiss
          </button>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-800 bg-green-950 p-4 text-sm text-green-300">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[
          ["Investment", allTotals.investment],

          ["Revenue", allTotals.revenue],

          ["Costs", allTotals.costs],

          ["Profit / loss", allTotals.profit],

          ["Stock remaining", allTotals.remaining],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-700 bg-[#191e1b] p-4 text-white"
          >
            <p className="text-xs text-slate-400">{label} · All tables</p>

            <p className="mt-2 break-words font-bold text-green-300">
              {label === "Stock remaining" ? value : money(value, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-700 bg-[#101312] p-3 text-white">
          <h4 className="px-2 py-3 font-bold">Your tables ({tables.length})</h4>

          {loading && (
            <p className="px-2 py-3 text-sm text-slate-400">Loading...</p>
          )}

          {!loading && tables.length === 0 && (
            <p className="px-2 py-3 text-sm text-slate-400">
              No tables found. Create your first table above.
            </p>
          )}

          <div className="space-y-2">
            {tables.map((table) => (
              <button
                key={table.tableId}
                onClick={() => setSelectedId(table.tableId)}
                className={`w-full rounded-xl border p-3 text-left ${
                  selectedId === table.tableId
                    ? "border-green-500 bg-[#203127]"
                    : "border-slate-700 hover:bg-[#191e1b]"
                }`}
              >
                <p className="font-semibold">{table.tableName}</p>

                <p className="mt-1 text-xs text-slate-400">{table.date}</p>

                <p className="mt-1 text-xs text-green-300">
                  {table.rows?.length || 0} saved rows
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          {!selectedId ? (
            <div className="rounded-2xl border border-slate-700 bg-[#101312] p-10 text-center text-slate-400">
              Select a table or create a new one to start entering products.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-[#191e1b] p-4 text-white">
                <div>
                  <h4 className="text-lg font-bold text-green-300">
                    {selectedTable?.tableName || "Selected table"}
                  </h4>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedTable?.date} · {rows.length} rows
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRows((old) => [blankRow(), ...old])}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 font-semibold hover:bg-green-500"
                  >
                    <Plus size={16} /> Add Row
                  </button>

                  <button
                    onClick={deleteTable}
                    className="flex items-center gap-2 rounded-lg bg-red-900 px-3 py-2 text-red-200 hover:bg-red-800"
                  >
                    <Trash2 size={16} /> Delete Table
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {summaryCards.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-700 bg-[#191e1b] p-3 text-white"
                  >
                    <p className="text-xs text-slate-400">{label}</p>

                    <p className="mt-2 break-words font-bold">
                      {label === "Stock remaining"
                        ? value
                        : money(value, currency)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="rounded-2xl border border-slate-700 bg-[#101312] p-8 text-center text-slate-400">
                    Loading accounting records...
                  </div>
                ) : rows.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-600 bg-[#101312] p-10 text-center text-slate-400">
                    <FileSpreadsheet
                      size={32}
                      className="mx-auto mb-3 text-slate-500"
                    />
                    <p className="font-semibold text-white">
                      No records in this table yet
                    </p>
                    <p className="mt-1 text-sm">
                      Click “Add Row” to enter your first product.
                    </p>
                  </div>
                ) : (
                  rows.map((row, index) => {
                    const result = calculate(row);
                    const isNew = String(row._id).startsWith("new-");
                    const inputClass =
                      "w-full rounded-lg border border-slate-700 bg-[#101312] px-3 py-2.5 text-sm text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-900";
                    const labelClass =
                      "mb-1.5 block text-xs font-medium text-slate-400";

                    const textField = (field, label, type = "text", min) => (
                      <label key={field} className="block min-w-0">
                        <span className={labelClass}>{label}</span>
                        <input
                          type={type}
                          min={min}
                          step={type === "number" ? "any" : undefined}
                          value={row[field] ?? ""}
                          onChange={(e) =>
                            updateCell(row._id, field, e.target.value)
                          }
                          className={inputClass}
                        />
                      </label>
                    );

                    return (
                      <article
                        key={row._id}
                        className="overflow-hidden rounded-2xl border border-slate-700 bg-[#101312] text-white shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-[#191e1b] px-4 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-950 font-bold text-green-300">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <h5 className="truncate font-semibold">
                                {row.productName || "New product"}
                              </h5>
                              <p className="text-xs text-slate-400">
                                {isNew ? "Not saved yet" : "Saved record"} ·{" "}
                                {row.date || selectedTable?.date || ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveRow(row)}
                              disabled={savingId === row._id}
                              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Save size={16} />
                              {savingId === row._id
                                ? "Saving..."
                                : isNew
                                  ? "Save Record"
                                  : "Save Changes"}
                            </button>
                            <button
                              onClick={() => deleteRow(row)}
                              title="Delete record"
                              className="rounded-lg border border-red-900 bg-red-950 p-2 text-red-300 hover:bg-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-5 p-4">
                          <section>
                            <h6 className="mb-3 text-xs font-bold uppercase tracking-wider text-green-300">
                              Product details
                            </h6>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              {textField("date", "Date", "date")}
                              {textField("productName", "Product name")}
                              {textField(
                                "quantityPurchased",
                                "Quantity bought",
                                "number",
                                0,
                              )}
                              {textField(
                                "quantitySold",
                                "Quantity sold",
                                "number",
                                0,
                              )}
                            </div>
                          </section>

                          <section>
                            <h6 className="mb-3 text-xs font-bold uppercase tracking-wider text-green-300">
                              Prices and costs
                            </h6>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              {textField(
                                "purchasePrice",
                                "Buy price per item",
                                "number",
                                0,
                              )}
                              {textField(
                                "sellingPrice",
                                "Sell price per item",
                                "number",
                                0,
                              )}
                              {textField(
                                "shippingCost",
                                "Shipping cost",
                                "number",
                                0,
                              )}
                              {textField(
                                "otherCosts",
                                "Other costs",
                                "number",
                                0,
                              )}
                            </div>
                          </section>

                          <section>
                            <h6 className="mb-3 text-xs font-bold uppercase tracking-wider text-green-300">
                              Discount and notes
                            </h6>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                              <label className="block min-w-0">
                                <span className={labelClass}>
                                  Discount type
                                </span>
                                <select
                                  value={row.discountType || "amount"}
                                  onChange={(e) =>
                                    updateCell(
                                      row._id,
                                      "discountType",
                                      e.target.value,
                                    )
                                  }
                                  className={inputClass}
                                >
                                  <option value="amount">Fixed amount</option>
                                  <option value="percent">Percentage</option>
                                </select>
                              </label>
                              <label className="block min-w-0">
                                <span className={labelClass}>
                                  Discount{" "}
                                  {row.discountType === "percent"
                                    ? "(%)"
                                    : `(${currency})`}
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  max={
                                    row.discountType === "percent"
                                      ? 100
                                      : undefined
                                  }
                                  value={row.discountValue ?? 0}
                                  onChange={(e) =>
                                    updateCell(
                                      row._id,
                                      "discountValue",
                                      e.target.value,
                                    )
                                  }
                                  className={inputClass}
                                />
                              </label>
                              <label className="block min-w-0 sm:col-span-2 xl:col-span-1">
                                <span className={labelClass}>Notes</span>
                                <input
                                  value={row.notes || ""}
                                  onChange={(e) =>
                                    updateCell(row._id, "notes", e.target.value)
                                  }
                                  placeholder="Optional notes..."
                                  className={inputClass}
                                />
                              </label>
                            </div>
                          </section>

                          <section className="border-t border-slate-700 pt-4">
                            <h6 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Calculated results
                            </h6>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                              {[
                                ["Revenue", result.revenue, "text-green-300"],
                                ["Costs", result.costs, "text-orange-300"],
                                [
                                  "Profit / loss",
                                  result.profit,
                                  result.profit >= 0
                                    ? "text-green-300"
                                    : "text-red-300",
                                ],
                                [
                                  "Stock remaining",
                                  result.remaining,
                                  "text-white",
                                ],
                                [
                                  "Discount total",
                                  result.discount,
                                  "text-amber-300",
                                ],
                              ].map(([label, value, color]) => (
                                <div
                                  key={label}
                                  className="rounded-xl border border-slate-700 bg-[#191e1b] p-3"
                                >
                                  <p className="text-xs text-slate-400">
                                    {label}
                                  </p>
                                  <p
                                    className={`mt-1 break-words font-bold ${color}`}
                                  >
                                    {label === "Stock remaining"
                                      ? value
                                      : money(value, currency)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function DatabaseFront() {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [sales, setSales] = useState([]);

  const [activeTab, setActiveTab] = useState("sale");

  const [search, setSearch] = useState("");

  const [currency, setCurrency] = useState("AFN");

  const [saleDate, setSaleDate] = useState(today());

  const [reportDate, setReportDate] = useState(today());

  const [shippingMode, setShippingMode] = useState("per-sale");

  const [shippingTotal, setShippingTotal] = useState("0");

  const [otherOrderCosts, setOtherOrderCosts] = useState("0");

  const [discountOpen, setDiscountOpen] = useState(null);

  const [discountDraft, setDiscountDraft] = useState({
    type: "amount",

    value: "0",
  });

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [loadingSales, setLoadingSales] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const apiRequest = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok)
      throw new Error(data.message || data.error || `HTTP ${response.status}`);

    return data;
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);

    try {
      const data = await apiRequest(API_PRODUCTS);

      setProducts(getProductArray(data));

      setError("");
    } catch (err) {
      setError(`Could not load products: ${err.message}`);
    } finally {
      setLoadingProducts(false);
    }
  }, [apiRequest]);

  const loadSales = useCallback(async () => {
    setLoadingSales(true);

    try {
      const query = new URLSearchParams({
        from: reportDate,

        to: reportDate,

        currency,
      });

      const data = await apiRequest(`${API_SALES}?${query.toString()}`);

      setSales(Array.isArray(data) ? data : data.sales || []);
    } catch (err) {
      setError(`Could not load sales report: ${err.message}`);
    } finally {
      setLoadingSales(false);
    }
  }, [apiRequest, reportDate, currency]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((p) => productName(p).toLowerCase().includes(query));
  }, [products, search]);

  const addProduct = (product) => {
    const id = productId(product);

    if (!id) {
      setError("The selected product has no ID.");

      return;
    }

    setError("");

    setMessage("");

    setCart((old) => {
      const found = old.find((item) => item.productId === id);

      if (found) {
        return old.map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...old,

        {
          productId: id,

          productName: productName(product),

          image: productImage(product),

          quantity: 1,

          purchasePrice: purchasePrice(product),

          sellingPrice: sellingPrice(product),

          discountType: "amount",

          discountValue: 0,

          extraCost: 0,

          shippingShare: 0,
        },
      ];
    });
  };

  const updateItem = (id, key, value) => {
    setCart((old) =>
      old.map((item) =>
        item.productId === id
          ? {
              ...item,

              [key]:
                key === "discountType"
                  ? value
                  : Math.max(0, Number(value) || 0),
            }
          : item,
      ),
    );
  };

  const removeProduct = (id) =>
    setCart((old) => old.filter((item) => item.productId !== id));

  const calculateItem = (item) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);

    const grossRevenue = quantity * Math.max(0, Number(item.sellingPrice) || 0);

    const rawDiscount =
      item.discountType === "percent"
        ? (grossRevenue * (Number(item.discountValue) || 0)) / 100
        : Number(item.discountValue) || 0;

    const discountAmount = Math.min(grossRevenue, Math.max(0, rawDiscount));

    const netRevenue = grossRevenue - discountAmount;

    const shipping =
      shippingMode === "per-product"
        ? quantity * Math.max(0, Number(item.shippingShare) || 0)
        : 0;

    const totalCost =
      quantity * Math.max(0, Number(item.purchasePrice) || 0) +
      Math.max(0, Number(item.extraCost) || 0) +
      shipping;

    return {
      grossRevenue,

      discountAmount,

      netRevenue,

      totalCost,

      profit: netRevenue - totalCost,
    };
  };

  const totals = useMemo(() => {
    const calculated = cart.map(calculateItem);

    const grossRevenue = calculated.reduce(
      (sum, row) => sum + row.grossRevenue,

      0,
    );

    const discountTotal = calculated.reduce(
      (sum, row) => sum + row.discountAmount,

      0,
    );

    const netRevenue = calculated.reduce((sum, row) => sum + row.netRevenue, 0);

    const itemCosts = calculated.reduce((sum, row) => sum + row.totalCost, 0);

    const shipping =
      shippingMode === "per-sale" ? Number(shippingTotal) || 0 : 0;

    const totalCost = itemCosts + shipping + (Number(otherOrderCosts) || 0);

    return {
      grossRevenue,

      discountTotal,

      netRevenue,

      totalCost,

      profit: netRevenue - totalCost,

      count: cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    };
  }, [cart, shippingMode, shippingTotal, otherOrderCosts]);

  const saveSale = async () => {
    if (!cart.length)
      return setError("Choose at least one product before saving.");

    if (!saleDate) return setError("Choose the sale date.");

    if (cart.some((item) => Number(item.quantity) < 1))
      return setError("Every product must have a quantity of at least 1.");

    setSaving(true);

    setError("");

    setMessage("");

    const payload = {
      saleDate,

      currency,

      shippingMode,

      shippingTotal:
        shippingMode === "per-sale" ? Number(shippingTotal) || 0 : 0,

      otherOrderCosts: Number(otherOrderCosts) || 0,

      items: cart.map((item) => ({
        productId: item.productId,

        productName: item.productName,

        quantity: Number(item.quantity) || 1,

        purchasePrice: Number(item.purchasePrice) || 0,

        sellingPrice: Number(item.sellingPrice) || 0,

        discountType: item.discountType,

        discountValue: Number(item.discountValue) || 0,

        extraCost: Number(item.extraCost) || 0,

        shippingShare:
          shippingMode === "per-product" ? Number(item.shippingShare) || 0 : 0,
      })),
    };

    try {
      await apiRequest(API_SALES, {
        method: "POST",

        body: JSON.stringify(payload),
      });

      setMessage("Sale saved successfully.");

      setCart([]);

      setShippingTotal("0");

      setOtherOrderCosts("0");

      setSaleDate(today());

      setReportDate(saleDate);

      await loadSales();

      setActiveTab("reports");
    } catch (err) {
      setError(`Could not save sale: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openDiscount = (item) => {
    setDiscountDraft({
      type: item.discountType,

      value: String(item.discountValue),
    });

    setDiscountOpen(item.productId);
  };

  const applyDiscount = () => {
    const value = Math.max(0, Number(discountDraft.value) || 0);

    if (discountDraft.type === "percent" && value > 100) {
      setError("Discount percentage cannot exceed 100%.");

      return;
    }

    updateItem(discountOpen, "discountType", discountDraft.type);

    updateItem(discountOpen, "discountValue", value);

    setDiscountOpen(null);

    setError("");
  };

  const reportTotals = useMemo(
    () =>
      sales.reduce(
        (sum, sale) => ({
          revenue: sum.revenue + (Number(sale.netRevenue) || 0),

          costs: sum.costs + (Number(sale.totalCost) || 0),

          profit: sum.profit + (Number(sale.profit) || 0),

          count: sum.count + 1,
        }),

        { revenue: 0, costs: 0, profit: 0, count: 0 },
      ),

    [sales],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <Calculator size={23} />
          </div>

          <div>
            <h1 className="font-bold">Database Admin</h1>

            <p className="text-xs text-slate-400">Sales & accounting</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeTab === item.id
                    ? "bg-sky-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 hidden rounded-xl border border-slate-800 p-4 md:block">
          <p className="text-xs text-slate-400">Currency</p>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            {currencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                BUSINESS MANAGEMENT
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {navigation.find((item) => item.id === activeTab)?.label}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Manage products, sales, discounts, costs and accounting.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm md:hidden"
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  loadProducts();

                  loadSales();
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <RefreshCw size={17} /> Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>{error}</span>

              <button onClick={() => setError("")}>
                <X size={18} />
              </button>
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              {message}
            </div>
          )}

          {activeTab === "sale" && (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Net Sales"
                  value={money(totals.netRevenue, currency)}
                  icon={ShoppingCart}
                />

                <StatCard
                  title="Total Discounts"
                  value={money(totals.discountTotal, currency)}
                  icon={Tag}
                  tone="amber"
                />

                <StatCard
                  title="Total Costs"
                  value={money(totals.totalCost, currency)}
                  icon={Receipt}
                  tone="purple"
                />

                <StatCard
                  title={
                    totals.profit >= 0 ? "Estimated Profit" : "Estimated Loss"
                  }
                  value={money(Math.abs(totals.profit), currency)}
                  icon={totals.profit >= 0 ? TrendingUp : TrendingDown}
                  tone={totals.profit >= 0 ? "green" : "red"}
                />
              </div>

              <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-bold">Product Catalogue</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Select a product to add it to your sale.
                    </p>
                  </div>

                  <div className="relative w-full md:max-w-sm">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Product</th>

                        <th className="px-5 py-4">Selling Price</th>

                        <th className="px-5 py-4">Purchase Price</th>

                        <th className="px-5 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {loadingProducts ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center">
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center">
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr
                            key={productId(product)}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {productImage(product) ? (
                                  <img
                                    src={productImage(product)}
                                    alt={productName(product)}
                                    className="h-11 w-11 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                                    <Package size={20} />
                                  </div>
                                )}

                                <span className="font-semibold">
                                  {productName(product)}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 font-semibold">
                              {money(sellingPrice(product), currency)}
                            </td>

                            <td className="px-5 py-4">
                              {money(purchasePrice(product), currency)}
                            </td>

                            <td className="px-5 py-4">
                              <button
                                onClick={() => addProduct(product)}
                                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 font-semibold text-white hover:bg-sky-600"
                              >
                                <Plus size={16} /> Add Product
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-bold">Current Sale</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Adjust quantities, prices and discounts before saving.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays size={18} className="text-slate-400" />

                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      className="rounded-xl border border-slate-200 px-3 py-2.5"
                    />
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1150px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-4">Product</th>

                        <th className="px-3 py-4">Qty</th>

                        <th className="px-3 py-4">Buy Price</th>

                        <th className="px-3 py-4">Sell Price</th>

                        <th className="px-3 py-4">Discount</th>

                        <th className="px-3 py-4">Extra Cost</th>

                        {shippingMode === "per-product" && (
                          <th className="px-3 py-4">Shipping / Unit</th>
                        )}

                        <th className="px-3 py-4">Net Amount</th>

                        <th className="px-3 py-4">Profit / Loss</th>

                        <th className="px-3 py-4">Remove</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {cart.length === 0 ? (
                        <tr>
                          <td
                            colSpan={shippingMode === "per-product" ? 10 : 9}
                            className="p-12 text-center"
                          >
                            <ShoppingCart
                              size={36}
                              className="mx-auto mb-3 text-slate-300"
                            />

                            <p className="font-semibold">
                              No products added yet.
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Select a product from the table above.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        cart.map((item) => {
                          const result = calculateItem(item);

                          return (
                            <tr
                              key={item.productId}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-4 py-4 font-semibold">
                                {item.productName}
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() =>
                                      updateItem(
                                        item.productId,

                                        "quantity",

                                        Math.max(1, item.quantity - 1),
                                      )
                                    }
                                    className="rounded-md border p-1.5"
                                  >
                                    <Minus size={13} />
                                  </button>

                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateItem(
                                        item.productId,

                                        "quantity",

                                        e.target.value,
                                      )
                                    }
                                    className="w-14 rounded-lg border px-2 py-2 text-center"
                                  />

                                  <button
                                    onClick={() =>
                                      updateItem(
                                        item.productId,

                                        "quantity",

                                        item.quantity + 1,
                                      )
                                    }
                                    className="rounded-md border p-1.5"
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>
                              </td>

                              <td className="px-3 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.purchasePrice}
                                  onChange={(e) =>
                                    updateItem(
                                      item.productId,

                                      "purchasePrice",

                                      e.target.value,
                                    )
                                  }
                                  className="w-24 rounded-lg border px-2 py-2"
                                />
                              </td>

                              <td className="px-3 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.sellingPrice}
                                  onChange={(e) =>
                                    updateItem(
                                      item.productId,

                                      "sellingPrice",

                                      e.target.value,
                                    )
                                  }
                                  className="w-24 rounded-lg border px-2 py-2"
                                />
                              </td>

                              <td className="px-3 py-4">
                                <button
                                  onClick={() => openDiscount(item)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold hover:bg-slate-50"
                                >
                                  <Tag size={15} />

                                  {item.discountValue > 0
                                    ? item.discountType === "percent"
                                      ? `${item.discountValue}%`
                                      : money(item.discountValue, currency)
                                    : "Discount"}
                                </button>
                              </td>

                              <td className="px-3 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.extraCost}
                                  onChange={(e) =>
                                    updateItem(
                                      item.productId,

                                      "extraCost",

                                      e.target.value,
                                    )
                                  }
                                  className="w-24 rounded-lg border px-2 py-2"
                                />
                              </td>

                              {shippingMode === "per-product" && (
                                <td className="px-3 py-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.shippingShare}
                                    onChange={(e) =>
                                      updateItem(
                                        item.productId,

                                        "shippingShare",

                                        e.target.value,
                                      )
                                    }
                                    className="w-24 rounded-lg border px-2 py-2"
                                  />
                                </td>
                              )}

                              <td className="px-3 py-4 font-semibold">
                                {money(result.netRevenue, currency)}
                              </td>

                              <td
                                className={`px-3 py-4 font-bold ${result.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                              >
                                {money(result.profit, currency)}
                              </td>

                              <td className="px-3 py-4">
                                <button
                                  onClick={() => removeProduct(item.productId)}
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-5 border-t border-slate-100 bg-slate-50 p-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-bold">Shipping & Other Costs</h4>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-600">
                        Shipping Method
                      </span>

                      <select
                        value={shippingMode}
                        onChange={(e) => setShippingMode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                      >
                        <option value="per-sale">
                          One shipping cost for the order
                        </option>

                        <option value="per-product">
                          Shipping cost per unit
                        </option>
                      </select>
                    </label>

                    {shippingMode === "per-sale" && (
                      <Field
                        label={`Order Shipping (${currency})`}
                        type="number"
                        min="0"
                        value={shippingTotal}
                        onChange={setShippingTotal}
                      />
                    )}

                    <Field
                      label={`Other Order Costs (${currency})`}
                      type="number"
                      min="0"
                      value={otherOrderCosts}
                      onChange={setOtherOrderCosts}
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 font-bold">Sale Summary</h4>

                    <SummaryLine label="Total units" value={totals.count} />

                    <SummaryLine
                      label="Gross revenue"
                      value={money(totals.grossRevenue, currency)}
                    />

                    <SummaryLine
                      label="Discounts"
                      value={money(totals.discountTotal, currency)}
                    />

                    <SummaryLine
                      label="Total costs"
                      value={money(totals.totalCost, currency)}
                    />

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <SummaryLine
                        label={
                          totals.profit >= 0
                            ? "Estimated Profit"
                            : "Estimated Loss"
                        }
                        value={money(Math.abs(totals.profit), currency)}
                        strong
                        color={
                          totals.profit >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      />
                    </div>

                    <button
                      onClick={saveSale}
                      disabled={saving || cart.length === 0}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3.5 font-bold text-white hover:bg-sky-600 disabled:opacity-50"
                    >
                      <Save size={18} />

                      {saving ? "Saving..." : "Save Sale"}
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "products" && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <h3 className="text-lg font-bold">Product Catalogue</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Products loaded from your website API.
                  </p>
                </div>

                <button
                  onClick={loadProducts}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  <RefreshCw size={16} /> Refresh Products
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Product</th>

                      <th className="px-5 py-4">Selling Price</th>

                      <th className="px-5 py-4">Purchase Price</th>

                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr
                        key={productId(product)}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {productName(product)}
                        </td>

                        <td className="px-5 py-4">
                          {money(sellingPrice(product), currency)}
                        </td>

                        <td className="px-5 py-4">
                          {money(purchasePrice(product), currency)}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              addProduct(product);

                              setActiveTab("sale");
                            }}
                            className="flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-2 text-white hover:bg-sky-600"
                          >
                            <Plus size={15} /> Add to Sale
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!products.length && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-slate-500"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "reports" && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-bold">Daily Sales Reports</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a date to review saved sales.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2.5"
                  />

                  <button
                    onClick={loadSales}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
                  >
                    <Search size={16} /> View Report
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Number of Sales"
                  value={reportTotals.count}
                  icon={Receipt}
                />

                <StatCard
                  title="Net Revenue"
                  value={money(reportTotals.revenue, currency)}
                  icon={TrendingUp}
                />

                <StatCard
                  title="Total Costs"
                  value={money(reportTotals.costs, currency)}
                  icon={Calculator}
                  tone="purple"
                />

                <StatCard
                  title="Profit / Loss"
                  value={money(Math.abs(reportTotals.profit), currency)}
                  icon={reportTotals.profit >= 0 ? TrendingUp : TrendingDown}
                  tone={reportTotals.profit >= 0 ? "green" : "red"}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Date</th>

                      <th className="px-5 py-4">Products</th>

                      <th className="px-5 py-4">Net Revenue</th>

                      <th className="px-5 py-4">Total Cost</th>

                      <th className="px-5 py-4">Profit / Loss</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {loadingSales ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          Loading report...
                        </td>
                      </tr>
                    ) : sales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-slate-500"
                        >
                          No sales found for this date.
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr
                          key={sale._id || sale.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            {String(
                              sale.saleDate || sale.createdAt || "",
                            ).slice(0, 10) || "—"}
                          </td>

                          <td className="px-5 py-4">
                            {(sale.items || [])

                              .map(
                                (item) =>
                                  `${item.productName} × ${item.quantity}`,
                              )

                              .join(", ") || "—"}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {money(sale.netRevenue, currency)}
                          </td>

                          <td className="px-5 py-4">
                            {money(sale.totalCost, currency)}
                          </td>

                          <td
                            className={`px-5 py-4 font-bold ${Number(sale.profit) >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {money(sale.profit, currency)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "accounting" && (
            <AccountingSection currency={currency} setCurrency={setCurrency} />
          )}
        </div>
      </main>

      {discountOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Tag size={21} className="text-sky-500" /> Set Product Discount
              </h3>

              <button
                onClick={() => setDiscountOpen(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-600">
                Discount Type
              </span>

              <select
                value={discountDraft.type}
                onChange={(e) =>
                  setDiscountDraft((old) => ({ ...old, type: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
              >
                <option value="amount">Fixed amount ({currency})</option>

                <option value="percent">Percentage (%)</option>
              </select>
            </label>

            <div className="mt-4">
              <Field
                label="Discount Value"
                type="number"
                min="0"
                value={discountDraft.value}
                onChange={(value) =>
                  setDiscountDraft((old) => ({ ...old, value }))
                }
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDiscountOpen(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={applyDiscount}
                className="flex-1 rounded-xl bg-sky-500 px-4 py-3 font-bold text-white hover:bg-sky-600"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
