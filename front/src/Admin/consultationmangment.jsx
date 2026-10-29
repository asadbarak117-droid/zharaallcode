import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Layers,
  Plus,
  Search,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  House,
  CalendarDays,
  MessageCircle,
  Mail,
  Phone,
  UserRound,
  ClipboardList,
} from "lucide-react";

const PROBLEMS_API = "http://localhost:5000/api/beauty-problems";
const REQUESTS_API = "http://localhost:5000/api/consultation-requests";

const STATUSES = ["New", "Contacted", "Completed", "Cancelled"];

const STATUS_STYLES = {
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const emptyProblemForm = (number = 1) => ({
  number: String(number),
  category: "Skin",
  title: "",
  description: "",
  tips: [""],
});

function displayDate(value) {
  if (!value) return "Flexible";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString();
}

function displayDateTime(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

export default function ConsultationManagement() {
  const [activeTab, setActiveTab] = useState("problems");

  // Beauty problems state
  const [problems, setProblems] = useState([]);
  const [problemForm, setProblemForm] = useState(emptyProblemForm());
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [problemSearch, setProblemSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [problemLoading, setProblemLoading] = useState(true);
  const [problemSaving, setProblemSaving] = useState(false);
  const [problemError, setProblemError] = useState("");
  const [problemMessage, setProblemMessage] = useState("");

  // Customer consultation requests state
  const [requests, setRequests] = useState([]);
  const [requestSearch, setRequestSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [updatingRequestId, setUpdatingRequestId] = useState("");

  const getNextNumber = () =>
    problems.reduce(
      (max, problem) => Math.max(max, Number(problem.number) || 0),
      0,
    ) + 1;

  // Load beauty problems
  const loadProblems = async () => {
    setProblemLoading(true);
    setProblemError("");

    try {
      const response = await fetch(PROBLEMS_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load beauty problems.");
      }

      const list = Array.isArray(data)
        ? data
        : data.problems || data.data || [];

      setProblems(
        [...list].sort((a, b) => Number(a.number || 0) - Number(b.number || 0)),
      );
    } catch (err) {
      setProblemError(
        err.message || "Could not connect to the beauty problems API.",
      );
    } finally {
      setProblemLoading(false);
    }
  };

  // Load consultation requests
  const loadRequests = async () => {
    setRequestLoading(true);
    setRequestError("");

    try {
      const response = await fetch(REQUESTS_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load consultation requests.",
        );
      }

      setRequests(
        Array.isArray(data) ? data : data.requests || data.data || [],
      );
    } catch (err) {
      setRequestError(
        err.message || "Could not connect to the consultation requests API.",
      );
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      loadRequests();
    }
  }, [activeTab]);

  // Search and filter beauty problems
  const filteredProblems = useMemo(() => {
    const query = problemSearch.trim().toLowerCase();

    return problems.filter((problem) => {
      const category = problem.category || "Skin";
      const tips = Array.isArray(problem.tips) ? problem.tips : [];

      const matchesCategory =
        categoryFilter === "All" ||
        category.toLowerCase() === categoryFilter.toLowerCase();

      const searchableText = [
        problem.number,
        category,
        problem.title || "",
        problem.description || "",
        ...tips,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [problems, problemSearch, categoryFilter]);

  // Search and filter customer requests
  const filteredRequests = useMemo(() => {
    const query = requestSearch.trim().toLowerCase();

    return requests.filter((request) => {
      const status = request.status || "New";

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      const searchableText = [
        request.name,
        request.email,
        request.whatsapp,
        request.service,
        request.message,
        status,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [requests, requestSearch, statusFilter]);

  // Beauty problem form helpers
  const updateProblemField = (field, value) => {
    setProblemForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setProblemError("");
    setProblemMessage("");
  };

  const updateTip = (index, value) => {
    setProblemForm((previous) => ({
      ...previous,
      tips: previous.tips.map((tip, i) => (i === index ? value : tip)),
    }));
  };

  const addTip = () => {
    setProblemForm((previous) => ({
      ...previous,
      tips: [...previous.tips, ""],
    }));
  };

  const removeTip = (index) => {
    setProblemForm((previous) => ({
      ...previous,
      tips:
        previous.tips.length === 1
          ? [""]
          : previous.tips.filter((_, i) => i !== index),
    }));
  };

  const startNewProblem = () => {
    setEditingProblemId(null);
    setProblemForm(emptyProblemForm(getNextNumber()));
    setProblemError("");
    setProblemMessage("");
    setActiveTab("editor");
  };

  const startEditProblem = (problem) => {
    const id = problem._id || problem.id;

    if (!id) {
      setProblemError("This problem does not have a database ID.");
      return;
    }

    setEditingProblemId(id);

    setProblemForm({
      number: String(problem.number ?? ""),
      category: problem.category || "Skin",
      title: problem.title || "",
      description: problem.description || "",
      tips:
        Array.isArray(problem.tips) && problem.tips.length
          ? [...problem.tips]
          : [""],
    });

    setProblemError("");
    setProblemMessage("");
    setActiveTab("editor");
  };

  const cancelProblemEdit = () => {
    setEditingProblemId(null);
    setProblemForm(emptyProblemForm(getNextNumber()));
    setProblemError("");
    setProblemMessage("");
    setActiveTab("problems");
  };

  const saveProblem = async (event) => {
    event.preventDefault();

    setProblemError("");
    setProblemMessage("");

    const payload = {
      number: Number(problemForm.number),
      category: problemForm.category,
      title: problemForm.title.trim(),
      description: problemForm.description.trim(),
      tips: problemForm.tips.map((tip) => tip.trim()).filter(Boolean),
    };

    if (!Number.isInteger(payload.number) || payload.number < 1) {
      setProblemError("Enter a valid positive whole number.");
      return;
    }

    if (!payload.title || !payload.description) {
      setProblemError("Title and description are required.");
      return;
    }

    try {
      setProblemSaving(true);

      const response = await fetch(
        editingProblemId ? `${PROBLEMS_API}/${editingProblemId}` : PROBLEMS_API,
        {
          method: editingProblemId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save the problem.");
      }

      const wasEditing = Boolean(editingProblemId);

      setEditingProblemId(null);
      setProblemForm(emptyProblemForm(payload.number + 1));

      await loadProblems();

      setProblemMessage(
        wasEditing
          ? "Beauty problem updated successfully."
          : "Beauty problem added successfully.",
      );

      setActiveTab("problems");
    } catch (err) {
      setProblemError(err.message || "Could not save the problem.");
    } finally {
      setProblemSaving(false);
    }
  };

  const deleteProblem = async (problem) => {
    const id = problem._id || problem.id;

    if (!id) {
      setProblemError("This problem does not have a database ID.");
      return;
    }

    if (!window.confirm(`Delete "${problem.title}"?`)) return;

    setProblemError("");
    setProblemMessage("");

    try {
      const response = await fetch(`${PROBLEMS_API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete the problem.");
      }

      if (editingProblemId === id) {
        setEditingProblemId(null);
        setProblemForm(emptyProblemForm());
      }

      await loadProblems();
      setProblemMessage("Beauty problem deleted successfully.");
    } catch (err) {
      setProblemError(err.message || "Could not delete the problem.");
    }
  };

  // Customer request actions
  const updateRequestStatus = async (id, status) => {
    setUpdatingRequestId(id);
    setRequestError("");
    setRequestMessage("");

    try {
      const response = await fetch(`${REQUESTS_API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update the request.");
      }

      setRequests((previous) =>
        previous.map((request) =>
          (request._id || request.id) === id
            ? {
                ...request,
                status: data.request?.status || status,
              }
            : request,
        ),
      );

      setRequestMessage("Request status updated successfully.");
    } catch (err) {
      setRequestError(err.message || "Could not update request status.");
    } finally {
      setUpdatingRequestId("");
    }
  };

  const deleteRequest = async (request) => {
    const id = request._id || request.id;

    if (!id) {
      setRequestError("This request does not have a database ID.");
      return;
    }

    if (
      !window.confirm(
        `Delete the consultation request from ${request.name || "this customer"}?`,
      )
    ) {
      return;
    }

    setRequestError("");
    setRequestMessage("");

    try {
      const response = await fetch(`${REQUESTS_API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete the request.");
      }

      setRequests((previous) =>
        previous.filter((item) => (item._id || item.id) !== id),
      );

      setRequestMessage("Consultation request deleted successfully.");
    } catch (err) {
      setRequestError(err.message || "Could not delete the request.");
    }
  };

  const countStatus = (status) =>
    requests.filter((item) => (item.status || "New") === status).length;

  const openPublicPage = () => {
    window.open("/consultation", "_blank", "noopener,noreferrer");
  };

  const sidebarButton = (id, label, Icon) => (
    <button
      key={id}
      type="button"
      onClick={() => {
        setActiveTab(id);
        setProblemError("");
        setRequestError("");
        setProblemMessage("");
        setRequestMessage("");
      }}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
        activeTab === id
          ? "bg-sky-400 font-semibold text-slate-950"
          : "text-slate-300 hover:bg-slate-800"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* SIDEBAR */}
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <Sparkles size={23} />
          </div>

          <div>
            <h1 className="font-bold">Ledora Admin</h1>
            <p className="text-xs text-slate-400">Consultation management</p>
          </div>
        </div>

        <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
          {sidebarButton("problems", "Beauty Problems", Layers)}
          {sidebarButton("editor", "Add / Edit Problem", Plus)}
          {sidebarButton("requests", "Consultation Requests", CalendarDays)}

          <button
            type="button"
            onClick={openPublicPage}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <Eye size={18} />
            Public Consultation
          </button>

          <a
            href="/admin/website"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <House size={18} />
            Website Management
          </a>
        </nav>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Current section
          </p>
          <p className="mt-2 text-sm font-medium">
            {activeTab === "requests"
              ? "Customer Requests"
              : activeTab === "editor"
                ? "Problem Editor"
                : "Beauty Guide"}
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                WEBSITE SETTINGS
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {activeTab === "requests"
                  ? "Consultation Requests"
                  : activeTab === "editor"
                    ? editingProblemId
                      ? "Edit Beauty Problem"
                      : "Add Beauty Problem"
                    : "Consultation Management"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {activeTab === "requests"
                  ? "View and manage requests submitted through your public consultation form."
                  : activeTab === "editor"
                    ? "Create or update the beauty information shown on your public page."
                    : "Manage skin and hair problems, descriptions, and helpful tips."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openPublicPage}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <Eye size={17} />
                Preview
              </button>

              <button
                type="button"
                onClick={activeTab === "requests" ? loadRequests : loadProblems}
                disabled={
                  activeTab === "requests" ? requestLoading : problemLoading
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              {activeTab !== "requests" && (
                <button
                  type="button"
                  onClick={startNewProblem}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  <Plus size={17} />
                  Add Problem
                </button>
              )}
            </div>
          </div>

          {/* BEAUTY PROBLEMS */}
          {activeTab !== "requests" && (
            <>
              {problemError && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <span>{problemError}</span>
                </div>
              )}

              {problemMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <span>{problemMessage}</span>
                </div>
              )}

              {activeTab === "editor" && (
                <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-sky-600">
                        {editingProblemId ? "Update Record" : "Create Record"}
                      </p>
                      <h3 className="mt-1 text-xl font-bold">
                        {editingProblemId
                          ? "Edit Problem Details"
                          : "New Beauty Problem"}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                      {editingProblemId ? (
                        <Pencil size={23} />
                      ) : (
                        <Plus size={23} />
                      )}
                    </div>
                  </div>

                  <form onSubmit={saveProblem} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-600">
                          Problem Number
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={problemForm.number}
                          onChange={(e) =>
                            updateProblemField("number", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        />
                      </label>

                      <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-600">
                          Category
                        </span>
                        <select
                          value={problemForm.category}
                          onChange={(e) =>
                            updateProblemField("category", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        >
                          <option value="Skin">Skin</option>
                          <option value="Hair">Hair</option>
                        </select>
                      </label>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-600">
                        Problem Title
                      </span>
                      <input
                        type="text"
                        maxLength={120}
                        required
                        value={problemForm.title}
                        onChange={(e) =>
                          updateProblemField("title", e.target.value)
                        }
                        placeholder="For example: Dry Skin"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-600">
                        Description
                      </span>
                      <textarea
                        rows={4}
                        maxLength={1500}
                        required
                        value={problemForm.description}
                        onChange={(e) =>
                          updateProblemField("description", e.target.value)
                        }
                        placeholder="Describe the beauty problem..."
                        className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </label>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-700">
                          Helpful Tips
                        </h4>
                        <button
                          type="button"
                          onClick={addTip}
                          className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          <Plus size={16} />
                          Add Tip
                        </button>
                      </div>

                      <div className="space-y-3">
                        {problemForm.tips.map((tip, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              maxLength={300}
                              value={tip}
                              onChange={(e) => updateTip(index, e.target.value)}
                              placeholder={`Helpful tip ${index + 1}`}
                              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                            <button
                              type="button"
                              onClick={() => removeTip(index)}
                              title="Remove tip"
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        disabled={problemSaving}
                        className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                      >
                        {problemSaving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        {problemSaving
                          ? "Saving..."
                          : editingProblemId
                            ? "Save Changes"
                            : "Add Problem"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelProblemEdit}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {activeTab === "problems" && (
                <>
                  <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { label: "Total Problems", value: problems.length },
                      {
                        label: "Skin Problems",
                        value: problems.filter(
                          (p) => (p.category || "").toLowerCase() === "skin",
                        ).length,
                      },
                      {
                        label: "Hair Problems",
                        value: problems.filter(
                          (p) => (p.category || "").toLowerCase() === "hair",
                        ).length,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="mt-2 text-3xl font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row">
                      <div className="relative min-w-0 flex-1">
                        <Search
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="search"
                          value={problemSearch}
                          onChange={(e) => setProblemSearch(e.target.value)}
                          placeholder="Search problems, descriptions, or tips..."
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["All", "Skin", "Hair"].map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setCategoryFilter(category)}
                            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                              categoryFilter === category
                                ? "bg-sky-500 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-sky-50"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  {problemLoading ? (
                    <div className="flex min-h-56 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-500">
                      <Loader2 size={22} className="animate-spin" />
                      Loading beauty problems...
                    </div>
                  ) : problemError && problems.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                      <AlertCircle
                        size={32}
                        className="mx-auto mb-3 text-red-500"
                      />
                      <h3 className="text-lg font-bold">
                        Could not load problems
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Check your backend and MongoDB connection.
                      </p>
                      <button
                        type="button"
                        onClick={loadProblems}
                        className="mt-5 rounded-xl bg-sky-500 px-4 py-2.5 font-semibold text-white hover:bg-sky-600"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : filteredProblems.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                      <Sparkles
                        size={34}
                        className="mx-auto mb-3 text-sky-500"
                      />
                      <h3 className="text-lg font-bold">
                        No beauty problems found
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Add a problem or change your search.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProblems.map((problem) => {
                        const id = problem._id || problem.id;
                        const tips = Array.isArray(problem.tips)
                          ? problem.tips
                          : [];

                        return (
                          <article
                            key={id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 font-bold text-sky-700">
                                {String(problem.number ?? "").padStart(2, "0")}
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                  {problem.category || "Skin"}
                                </span>

                                <h3 className="mt-2 text-lg font-bold">
                                  {problem.title}
                                </h3>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {problem.description}
                                </p>

                                {tips.length > 0 && (
                                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                    <h4 className="mb-2 text-sm font-semibold">
                                      Helpful Tips
                                    </h4>
                                    <ul className="space-y-2">
                                      {tips.map((tip, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2 text-sm text-slate-600"
                                        >
                                          <CheckCircle2
                                            size={16}
                                            className="mt-0.5 shrink-0 text-sky-600"
                                          />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                  <button
                                    type="button"
                                    onClick={() => startEditProblem(problem)}
                                    className="flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                                  >
                                    <Pencil size={16} />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteProblem(problem)}
                                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* CONSULTATION REQUESTS */}
          {activeTab === "requests" && (
            <>
              {requestError && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <span>{requestError}</span>
                </div>
              )}

              {requestMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <span>{requestMessage}</span>
                </div>
              )}

              <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Total Requests", value: requests.length },
                  { label: "New", value: countStatus("New") },
                  { label: "Contacted", value: countStatus("Contacted") },
                  { label: "Completed", value: countStatus("Completed") },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-3xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>

              <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={requestSearch}
                      onChange={(e) => setRequestSearch(e.target.value)}
                      placeholder="Search name, email, WhatsApp, or service..."
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="All">All statuses</option>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {requestLoading ? (
                <div className="flex min-h-56 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-500">
                  <Loader2 size={22} className="animate-spin" />
                  Loading consultation requests...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <CalendarDays
                    size={34}
                    className="mx-auto mb-3 text-sky-500"
                  />
                  <h3 className="text-lg font-bold">
                    No consultation requests found
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    When customers submit the public consultation form, their
                    requests will appear here.
                  </p>

                  {requestError && (
                    <button
                      type="button"
                      onClick={loadRequests}
                      className="mt-5 rounded-xl bg-sky-500 px-4 py-2.5 font-semibold text-white hover:bg-sky-600"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => {
                    const id = request._id || request.id;
                    const status = request.status || "New";

                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                            <UserRound size={24} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="break-words text-lg font-bold">
                                {request.name}
                              </h3>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  STATUS_STYLES[status] || STATUS_STYLES.New
                                }`}
                              >
                                {status}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              Received {displayDateTime(request.createdAt)}
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <p className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
                                <Mail
                                  size={17}
                                  className="mt-0.5 shrink-0 text-sky-600"
                                />
                                <span className="break-all">
                                  {request.email || "No email"}
                                </span>
                              </p>

                              <p className="flex items-start gap-2 text-sm text-slate-600">
                                <Phone
                                  size={17}
                                  className="mt-0.5 shrink-0 text-sky-600"
                                />
                                <span>
                                  {request.whatsapp || "No WhatsApp number"}
                                </span>
                              </p>

                              <p className="flex items-start gap-2 text-sm text-slate-600">
                                <MessageCircle
                                  size={17}
                                  className="mt-0.5 shrink-0 text-sky-600"
                                />
                                <span>
                                  {request.service || "No service selected"}
                                </span>
                              </p>

                              <p className="flex items-start gap-2 text-sm text-slate-600">
                                <CalendarDays
                                  size={17}
                                  className="mt-0.5 shrink-0 text-sky-600"
                                />
                                <span>
                                  Preferred date: {displayDate(request.date)}
                                </span>
                              </p>
                            </div>

                            <div className="mt-4 rounded-xl bg-slate-50 p-4">
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Customer Message
                              </p>
                              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {request.message || "No message provided."}
                              </p>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                              <label className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
                                Request status
                                <select
                                  value={status}
                                  disabled={updatingRequestId === id}
                                  onChange={(e) =>
                                    updateRequestStatus(id, e.target.value)
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                                >
                                  {STATUSES.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              {updatingRequestId === id && (
                                <Loader2
                                  size={17}
                                  className="animate-spin text-sky-600"
                                />
                              )}

                              <button
                                type="button"
                                onClick={() => deleteRequest(request)}
                                className="ml-auto flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                                Delete Request
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
            Consultation Management · Ledora Website Admin
          </div>
        </div>
      </main>
    </div>
  );
}
