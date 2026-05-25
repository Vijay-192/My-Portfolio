import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, assignRoleThunk } from "../../../redux-store/authSlice";
import { Users, ShieldCheck, PenTool, RefreshCw } from "lucide-react";

const ROLE_STYLE = {
  admin:   { bg: "#3b82f618", color: "#60a5fa", border: "#3b82f635", icon: "🔑" },
  blogger: { bg: "#f59e0b18", color: "#f59e0b", border: "#f59e0b35", icon: "✍️" },
};

function UserManagement() {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((s) => s.auth);
  const [updating, setUpdating] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    setFeedback({ type: "", msg: "" });
    const result = await dispatch(assignRoleThunk({ targetUserId: userId, role: newRole }));
    if (assignRoleThunk.fulfilled.match(result)) {
      setFeedback({ type: "ok", msg: `Role updated to "${newRole}" ✓` });
    } else {
      setFeedback({ type: "err", msg: result.payload ?? "Update failed." });
    }
    setUpdating(null);
    setTimeout(() => setFeedback({ type: "", msg: "" }), 3500);
  };

  const adminCount   = users.filter((u) => u.role === "admin").length;
  const bloggerCount = users.filter((u) => u.role === "blogger").length;

  return (
    <div style={s.wrap}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.titleRow}>
            <Users size={20} color="#60a5fa" />
            <h2 style={s.title}>User Management</h2>
          </div>
          <p style={s.sub}>Sare registered users aur unke roles manage karein</p>
        </div>
        <button style={s.refreshBtn} onClick={() => dispatch(fetchUsersThunk())}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary pills */}
      <div style={s.pillRow}>
        <Pill icon={<ShieldCheck size={13} />} label="Admins"   count={adminCount}   color="#60a5fa" />
        <Pill icon={<PenTool     size={13} />} label="Bloggers" count={bloggerCount} color="#f59e0b" />
        <Pill icon={<Users       size={13} />} label="Total"    count={users.length} color="#888"    />
      </div>

      {/* Feedback */}
      {feedback.msg && (
        <div style={feedback.type === "ok" ? s.alertOk : s.alertErr}>
          {feedback.msg}
        </div>
      )}

      {/* Table */}
      {usersLoading ? (
        <div style={s.loader}>Loading users…</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Name", "Email", "Current Role", "Change Role", "Joined"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rs = ROLE_STYLE[u.role] ?? ROLE_STYLE.blogger;
                const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email;
                const initial = (u.firstName?.[0] ?? u.email?.[0] ?? "?").toUpperCase();
                return (
                  <tr key={u._id} style={s.tr}>
                    <td style={{ ...s.td, color: "#555", fontSize: 12 }}>{i + 1}</td>

                    <td style={s.td}>
                      <div style={s.nameRow}>
                        <div style={{ ...s.avatar, background: rs.color + "30", color: rs.color }}>
                          {initial}
                        </div>
                        <span style={s.nameText}>{name}</span>
                      </div>
                    </td>

                    <td style={s.td}>
                      <span style={s.email}>{u.email}</span>
                    </td>

                    <td style={s.td}>
                      <span style={{
                        padding: "3px 12px", borderRadius: 20, fontSize: 12,
                        fontWeight: 700, background: rs.bg, color: rs.color,
                        border: `1px solid ${rs.border}`,
                      }}>
                        {rs.icon} {u.role}
                      </span>
                    </td>

                    <td style={s.td}>
                      <select
                        value={u.role}
                        disabled={updating === u._id}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={s.select}
                      >
                        <option value="blogger">✍️ blogger</option>
                        <option value="admin">🔑 admin</option>
                      </select>
                      {updating === u._id && (
                        <span style={{ marginLeft: 8, fontSize: 11, color: "#666" }}>…</span>
                      )}
                    </td>

                    <td style={s.td}>
                      <span style={s.date}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p style={s.empty}>Koi user nahi mila.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Pill({ icon, label, count, color }) {
  return (
    <div style={{ ...pl.pill, borderColor: color + "30" }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ color, fontWeight: 700, fontSize: 15 }}>{count}</span>
      <span style={{ color: "#666", fontSize: 12 }}>{label}</span>
    </div>
  );
}

const DARK   = "#191c23";
const BORDER = "#23262e";

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  title: { margin: 0, fontSize: 20, fontWeight: 700, color: "#e8e4dc" },
  sub:   { margin: 0, fontSize: 13, color: "#666" },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    background: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    color: "#888",
    fontSize: 13,
    cursor: "pointer",
  },
  pillRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  alertOk: {
    padding: "10px 14px",
    background: "#22c55e15",
    border: "1px solid #22c55e40",
    borderRadius: 10,
    color: "#4ade80",
    fontSize: 13,
  },
  alertErr: {
    padding: "10px 14px",
    background: "#ef444415",
    border: "1px solid #ef444440",
    borderRadius: 10,
    color: "#f87171",
    fontSize: 13,
  },
  loader: { color: "#666", fontSize: 14, padding: "20px 0" },
  tableWrap: {
    background: DARK,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: `1px solid ${BORDER}`,
    background: "#13151c",
  },
  tr: { borderBottom: `1px solid ${BORDER}` },
  td: { padding: "13px 16px", fontSize: 13, verticalAlign: "middle", color: "#e0ddd8" },
  nameRow: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 13, flexShrink: 0,
  },
  nameText: { fontWeight: 600 },
  email:    { color: "#777", fontSize: 12 },
  date:     { color: "#555", fontSize: 12 },
  empty:    { padding: "32px", textAlign: "center", color: "#555", fontSize: 13 },
  select: {
    background: "#13151c",
    border: `1px solid ${BORDER}`,
    color: "#e0ddd8",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    cursor: "pointer",
    outline: "none",
  },
};

const pl = {
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: DARK,
    border: "1px solid",
    borderRadius: 12,
  },
};

export default UserManagement;