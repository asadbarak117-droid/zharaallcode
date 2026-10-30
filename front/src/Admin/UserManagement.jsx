import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  Power,
  PowerOff,
  ShieldCheck,
  Mail,
  X,
  RefreshCw,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com";

function UserManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load users");
      }

      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create admin");
      }

      setMessage("Admin created successfully.");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setShowForm(false);

      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (admin) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${admin._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !admin.isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update status");
      }

      setMessage("Admin status updated.");
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAdmin = async (admin) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${admin.name}?`,
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${admin._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete admin");
      }

      setMessage("Admin deleted successfully.");
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <div style={styles.iconBox}>
              <Users size={25} />
            </div>

            <div>
              <h1 style={styles.title}>User Management</h1>
              <p style={styles.subtitle}>
                Manage administrators of your Beauty Online Shop
              </p>
            </div>
          </div>
        </div>

        <div style={styles.headerButtons}>
          <button onClick={fetchAdmins} style={styles.refreshButton}>
            <RefreshCw size={17} />
            Refresh
          </button>

          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            <UserPlus size={18} />
            Add Admin
          </button>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={22} />
          </div>

          <div>
            <p style={styles.statLabel}>Total Admins</p>
            <h2 style={styles.statNumber}>{admins.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <ShieldCheck size={22} />
          </div>

          <div>
            <p style={styles.statLabel}>Active Admins</p>
            <h2 style={styles.statNumber}>
              {admins.filter((admin) => admin.isActive).length}
            </h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <PowerOff size={22} />
          </div>

          <div>
            <p style={styles.statLabel}>Inactive Admins</p>
            <h2 style={styles.statNumber}>
              {admins.filter((admin) => !admin.isActive).length}
            </h2>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Administrators</h2>
            <p style={styles.cardSubtitle}>Maximum allowed accounts: 3</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading administrators...</div>
        ) : admins.length === 0 ? (
          <div style={styles.empty}>
            <Users size={45} />
            <h3>No administrators found</h3>
            <p>Create the first administrator account.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Administrator</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>
                          {admin.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{admin.name}</strong>
                        </div>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.emailCell}>
                        <Mail size={15} />
                        {admin.email}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.role}>Administrator</span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...(admin.isActive ? styles.active : styles.inactive),
                        }}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => toggleStatus(admin)}
                          style={styles.actionButton}
                          title={admin.isActive ? "Deactivate" : "Activate"}
                        >
                          {admin.isActive ? (
                            <PowerOff size={17} />
                          ) : (
                            <Power size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => deleteAdmin(admin)}
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteButton,
                          }}
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Add Administrator</h2>
                <p style={styles.modalSubtitle}>Create a new admin account</p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <label style={styles.label}>Name</label>

              <input
                type="text"
                placeholder="Administrator name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                style={styles.input}
                required
              />

              <label style={styles.label}>Email</label>

              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                style={styles.input}
                required
              />

              <label style={styles.label}>Password</label>

              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                style={styles.input}
                minLength={8}
                required
              />

              <button type="submit" style={styles.createButton}>
                <UserPlus size={18} />
                Create Administrator
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "35px",
    background: "#f5f8fa",
    fontFamily: "Arial, sans-serif",
    color: "#304b5a",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#729db4",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#8797a0",
    fontSize: "14px",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
  },

  refreshButton: {
    border: "1px solid #d8e3e8",
    background: "#fff",
    color: "#527080",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  addButton: {
    border: "none",
    background: "#729db4",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontWeight: "600",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 5px 25px rgba(43,76,95,0.06)",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#edf5f8",
    color: "#729db4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#8797a0",
  },

  statNumber: {
    margin: "5px 0 0",
    fontSize: "25px",
  },

  card: {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 5px 25px rgba(43,76,95,0.06)",
    overflow: "hidden",
  },

  cardHeader: {
    padding: "22px 25px",
    borderBottom: "1px solid #edf1f3",
  },

  cardTitle: {
    margin: 0,
    fontSize: "19px",
  },

  cardSubtitle: {
    margin: "6px 0 0",
    color: "#8b9aa2",
    fontSize: "13px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "16px 20px",
    background: "#f9fbfc",
    color: "#6d808a",
    fontSize: "12px",
    textTransform: "uppercase",
  },

  td: {
    padding: "17px 20px",
    borderTop: "1px solid #edf1f3",
    fontSize: "14px",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#729db4",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  emailCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#71838d",
  },

  role: {
    background: "#edf5f8",
    color: "#527080",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  status: {
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  active: {
    background: "#e8f6ee",
    color: "#32905c",
  },

  inactive: {
    background: "#fbecec",
    color: "#c25a5a",
  },

  actions: {
    display: "flex",
    gap: "7px",
  },

  actionButton: {
    width: "36px",
    height: "36px",
    border: "1px solid #dce6eb",
    background: "#fff",
    borderRadius: "8px",
    color: "#607d8b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    color: "#c55c5c",
  },

  loading: {
    padding: "50px",
    textAlign: "center",
    color: "#81929b",
  },

  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#81929b",
  },

  success: {
    padding: "13px 17px",
    background: "#e9f7ef",
    color: "#31885a",
    borderRadius: "10px",
    marginBottom: "18px",
  },

  error: {
    padding: "13px 17px",
    background: "#fceded",
    color: "#bd5555",
    borderRadius: "10px",
    marginBottom: "18px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(30, 50, 60, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
  },

  modalSubtitle: {
    margin: "6px 0 0",
    color: "#8797a0",
    fontSize: "13px",
  },

  closeButton: {
    border: "none",
    background: "#f1f5f7",
    color: "#607d8b",
    width: "35px",
    height: "35px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "7px",
    color: "#405966",
  },

  input: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    border: "1px solid #dce6eb",
    borderRadius: "9px",
    padding: "0 13px",
    marginBottom: "18px",
    outline: "none",
    fontSize: "14px",
  },

  createButton: {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "9px",
    background: "#729db4",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "5px",
  },
};

export default UserManagement;
