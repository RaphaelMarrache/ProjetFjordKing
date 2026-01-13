import axios from "axios";
import React, { useState, useEffect } from "react";
import logoFjord from "./assets/logoFjord.jpeg";
import "./App.css";

const API_BASE = "https://projetfjordking.onrender.com"; // backend FastAPI

// ================== LOGIN TRAVAILLEUR ==================
function WorkerLogin({ onLogin }) {
  const [form, setForm] = useState({ identifier: "", code: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/worker/login`, form);
      onLogin(res.data); // { full_name, email, sector }
    } catch (err) {
      console.error(err);
      setError("Identifiant ou code incorrect");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Identification travailleur</h2>
      <form onSubmit={handleSubmit}>
        <label>Identifiant :</label>
        <input
          type="text"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Code :</label>
        <input
          type="password"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Se connecter
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 10, color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ================== FORMULAIRE CONGÃ‰S ==================
function VacationForm({ worker }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      worker_name: worker.full_name,
      worker_email: worker.email,
      sector: worker.sector,
      category: "vacation",
      start_date: form.startDate,
      end_date: form.endDate,
      reason: form.reason || null,
      title: "Demande de congés",
      description: form.reason || "Demande de congés",
      urgency: "normal",
    };

    try {
      const res = await axios.post(`${API_BASE}/requests`, payload);
      setMessage(`âœ… Demande de congés envoyÃ©e (ID : ${res.data.id})`);
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("âŒ Erreur lors de lâ€™envoi de la demande de congés");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h3>Demande de congés</h3>
      <p>
        EmployÃ© : <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>
      <form onSubmit={handleSubmit}>
        <label>Date de dÃ©but :</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Date de fin :</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Raison :</label>
        <textarea
          name="reason"
          rows={3}
          value={form.reason}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Envoyer la demande de congés
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontWeight: "bold",
            color: message.startsWith("âœ…")  "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ================== FORMULAIRE ARRÃŠT MALADIE ==================
function SickLeaveForm({ worker }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    let description = form.reason || "Congé maladie";
    if (file) {
      description += ` (fichier : ${file.name})`;
    }

    try {
      const formData = new FormData();
      formData.append("worker_name", worker.full_name);
      formData.append("worker_email", worker.email);
      formData.append("sector", worker.sector || "");
      formData.append("start_date", form.startDate);
      formData.append("end_date", form.endDate);
      formData.append("reason", form.reason || "");
      formData.append("title", "Congé maladie");
      formData.append("description", description);
      formData.append("urgency", "normal");
      if (file) {
        formData.append("attachment", file);
      }
      const res = await axios.post(`${API_BASE}/requests/sick`, formData);
      setMessage(`âœ… Congé maladie envoyÃ© (ID : ${res.data.id})`);
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("âŒ Erreur lors de lâ€™envoi du congé maladie");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h3>Demande d'arrÃªt maladie</h3>
      <p>
        EmployÃ© : <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>
      <form onSubmit={handleSubmit}>
        <label>Date de dÃ©but :</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Date de fin :</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Commentaire / raison (optionnel) :</label>
        <textarea
          name="reason"
          rows={3}
          value={form.reason}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Photo de lâ€™arrÃªt maladie (prototype) :</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Envoyer l'arrÃªt maladie
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontWeight: "bold",
            color: message.startsWith("âœ…")  "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ================== ESPACE TRAVAILLEUR ==================
function MyRequests({ worker }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!worker.full_name) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE}/worker/requests`, {
          params: { full_name: worker.full_name, email: worker.email },
        });
        setRequests(res.data || []);
      } catch (err) {
        console.error(
          "Worker fetchRequests error:",
          err.response.status,
          err.response.data || err
        );
        setError("Erreur lors du chargement des demandes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [worker]);

  if (loading) return <p>Chargementâ€¦</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0)
    return <p>Aucune demande enregistrÃ©e pour lâ€™instant.</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Mes demandes</h3>
      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0 }}>
            <b>Type :</b>{" "}
            {r.category === "vacation"
               "Congés"
              : r.category === "sick_leave"
               "ArrÃªt maladie"
              : r.category}
          </p>
          <p style={{ margin: "6px 0" }}>
            <b>Du :</b> {r.start_date} <b>au</b> {r.end_date}
          </p>
          <p style={{ margin: 0 }}>
            <b>Statut :</b>{" "}
            <span
              style={{
                color:
                  r.status === "terminÃ©e"
                     "green"
                    : r.status === "refusÃ©e"
                     "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {r.status}
            </span>
          </p>
          {r.manager_comment && (
            <p style={{ marginTop: 6 }}>
              <b>Commentaire du gérant :</b> {r.manager_comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function WorkerArea({ worker }) {
  const [tab, setTab] = useState(null); // null | "vacation" | "sick" | "mes_demandes"

  if (!worker) {
    return (
      <p style={{ textAlign: "center" }}>Erreur : aucun travailleur connectÃ©.</p>
    );
  }

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        ConnectÃ© en tant que <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => setTab("vacation")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: tab === "vacation"  "2px solid black" : "1px solid #ccc",
            backgroundColor: tab === "vacation"  "#f0f0f0" : "white",
          }}
        >
          Congés
        </button>
        <button
          onClick={() => setTab("sick")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: tab === "sick"  "2px solid black" : "1px solid #ccc",
            backgroundColor: tab === "sick"  "#f0f0f0" : "white",
          }}
        >
          ArrÃªt maladie
        </button>
        <button
          onClick={() => setTab("mes_demandes")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border:
              tab === "mes_demandes"  "2px solid black" : "1px solid #ccc",
            backgroundColor: tab === "mes_demandes"  "#f0f0f0" : "white",
          }}
        >
          Mes demandes
        </button>
      </div>

      {tab === "vacation" && <VacationForm worker={worker} />}
      {tab === "sick" && <SickLeaveForm worker={worker} />}
      {tab === "mes_demandes" && <MyRequests worker={worker} />}
    </div>
  );
}

// ================== LOGIN GERANT ==================
function AdminLogin({ onLogin }) {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, login);
      onLogin(res.data.token);
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Connexion gérant</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom d'utilisateur :</label>
        <input
          type="text"
          name="username"
          value={login.username}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Mot de passe :</label>
        <input
          type="password"
          name="password"
          value={login.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Se connecter
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 10, color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ================== TABLEAU DE BORD GERANT (CUMULÃ‰S) ==================
function AdminCumules({ token, onSelectEmployee }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchCumules = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/cumules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data.map(r => ({ ...r, edit: r.cumules_excel })));
    } catch (e) {
      console.error(e);
      setMsg("Erreur de chargement des congés cumulÃ©s");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCumules();
    const id = setInterval(fetchCumules, 10000);
    return () => clearInterval(id);
  }, []);

  const saveOne = async (full_name, value) => {
    setMsg("");
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/cumules/${encodeURIComponent(full_name)}`,
        { days: Number(value) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`Valeur mise Ã  jour pour ${full_name}`);
      // recharger depuis Excel pour Ãªtre sÃ»r
      fetchCumules();
    } catch (e) {
      console.error(e);
      setMsg("Erreur lors de l'enregistrement");
    }
  };

  if (loading) return <p>Chargementâ€¦</p>;

  return (
    <div style={{ marginTop: 10 }}>
      {msg && <p style={{ fontWeight: "bold" }}>{msg}</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>EmployÃ©</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Secteur</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>CumulÃ© (Excel)</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Modifier</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.full_name}>
                <td
                  style={{ borderBottom: "1px solid #f0f0f0", padding: 8, cursor: "pointer", textDecoration:"underline" }}
                  onClick={() => onSelectEmployee.(r.full_name)}
                  title="Voir lâ€™historique des demandes"
                >
                  {r.full_name}
                </td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.sector || "-"}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.cumules_excel}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                  <input
                    type="number"
                    value={r.edit}
                    onChange={(e) =>
                      setRows(prev =>
                        prev.map(x => x.full_name === r.full_name  { ...x, edit: e.target.value } : x)
                      )
                    }
                    style={{ width: 100 }}
                  />
                </td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                  <button onClick={() => saveOne(r.full_name, r.edit)}>Enregistrer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ================== TABLEAU DE BORD GERANT ==================
function AdminDashboard({ token, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar" | "cumules"

  const [historyFor, setHistoryFor] = useState(null); // full_name ou null
  const [historyRows, setHistoryRows] = useState([]);
  

  const openHistory = async (fullName) => {
    setHistoryFor(fullName);
    try {
       const res = await axios.get(`${API_BASE}/admin/employee/${encodeURIComponent(fullName)}/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      setHistoryRows(res.data);
    } catch (e) {
      console.error(e);
      setHistoryRows([]);
    }
  };

  const today = new Date();
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay(); // 0 dimanche, 1 lundi, ...
    const diff = (day === 0  -6 : 1) - day; // ramÃ¨ne Ã  lundi
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const [weekStart, setWeekStart] = useState(getMonday(today));

  const sectors = ["coupe-parage", "Reconstitution", "OS OT tarama", "commandes", "Autres"];

  const fetchRequests = async (archived) => {
    setMessage("");
    try {
      const res = await axios.get(`${API_BASE}/admin/requests`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { archived },            // ðŸ‘ˆ cache les traitÃ©es
      });
      setRequests(res.data || []);
      if (!res.data || res.data.length === 0) {
        console.log("Admin: aucune demande non archivÃ©e renvoyÃ©e");
      }
    } catch (err) {
      console.error(
        "Admin fetchRequests error:",
        err.response.status,
        err.response.data || err
      );
      setMessage("Erreur lors du chargement des demandes");
    }
  };

  useEffect(() => {
    if (viewMode === "list") {
      fetchRequests(false);
    }
    if (viewMode === "calendar") {
      fetchRequests(true);
    }
  }, [viewMode]);


  const handleChangeField = (id, field, value) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id  { ...r, [field]: value } : r))
    );
  };

  const saveRequest = async (id) => {
    const req = requests.find((r) => r.id === id);
    setMessage("");
    try {
      const res = await axios.patch(
        `${API_BASE}/admin/requests/${id}`,
        { status: req.status, manager_comment: req.manager_comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.warning) {
        setMessage(res.data.warning);
        window.alert(res.data.warning);
      } else {
        setMessage(`Demande ${id} mise à jour`);
      }
      await fetchRequests(false); // <- recharger la liste côté grant
    } catch (err) {
      console.error(err);
      const detail = err.response.data.detail;
      if (err.response.status === 409 && detail.message) {
        setMessage(detail.message);
        window.alert(detail.message);
        await fetchRequests(false);
        return;
      }
      setMessage("Erreur lors de la mise à jour");
    }
  };

  const downloadAttachment = async (id, name) => {
    try {
      const res = await axios.get(
        `${API_BASE}/admin/requests/${id}/attachment`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name || `piece-jointe-${id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors du tÃ©lÃ©chargement de la piÃ¨ce jointe");
    }
  };


  const filteredRequests = requests;

  // ---- MAP D'ABSENCE par jour + secteur ----
  function buildAbsenceMap() {
    const map = {}; // { "YYYY-MM-DD": { "1": [{ name, overLimit }], ... } }

    requests.forEach((r) => {
      if (r.status !== "terminÃ©e") return; // uniquement demandes acceptÃ©es
      if (!r.start_date || !r.end_date) return;
      const sector = r.sector || "1";
      const overLimit = Boolean(r.over_limit);

      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      let current = new Date(start);
      while (current <= end) {
        const key = current.toISOString().slice(0, 10);
        if (!map[key]) map[key] = {};
        if (!map[key][sector]) map[key][sector] = [];
        const existing = map[key][sector].find(
          (entry) => entry.name === r.worker_name
        );
        if (!existing) {
          map[key][sector].push({ name: r.worker_name, overLimit });
        } else if (overLimit) {
          existing.overLimit = true;
        }
        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }

  const absenceMap = buildAbsenceMap();

  function changeWeek(delta) {
    const newWeek = new Date(weekStart);
    newWeek.setDate(newWeek.getDate() + delta * 7);
    setWeekStart(newWeek);
  }

  function formatDate(d) {
    return d.toISOString().slice(0, 10);
  }

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  function renderWeeklyCalendar() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }

    return (
      <div style={{ marginTop: 15 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <button onClick={() => changeWeek(-1)}>â—€ Semaine prÃ©cÃ©dente</button>
          <strong>
            Semaine du {formatDate(days[0])} au {formatDate(days[6])}
          </strong>
          <button onClick={() => changeWeek(1)}>Semaine suivante â–¶</button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px repeat(7, 1fr)",
            gap: 4,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 6,
            maxHeight: 500,
            overflowY: "auto",
          }}
        >
          <div></div>
          {days.map((d, idx) => (
            <div
              key={idx}
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {dayNames[idx]} <br />
              {formatDate(d)}
            </div>
          ))}

          {sectors.map((sec) => (
            <React.Fragment key={`row-${sec}`}>
              <div
                style={{
                  fontWeight: "bold",
                  borderTop: "1px solid #eee",
                  paddingTop: 4,
                }}
              >
                Secteur {sec}
              </div>
              {days.map((d, idx) => {
                const key = formatDate(d);
                const names =
                  (absenceMap[key] && absenceMap[key][sec]) || [];
                const isConflict = names.length >= 2;

                return (
                  <div
                    key={`cell-${sec}-${idx}`}
                    style={{
                      borderTop: "1px solid #eee",
                      padding: 4,
                      fontSize: 12,
                      minHeight: 40,
                      backgroundColor: isConflict
                         "rgba(240, 107, 95, 0.2)"
                        : "transparent",
                      borderLeft: isConflict
                         "2px solid rgba(240, 107, 95, 0.6)"
                        : "2px solid transparent",
                    }}
                  >
                    {names.length === 0  (
                      <span style={{ color: "#888" }}>Tous prsents</span>
                    ) : (
                      <span style={isConflict  { fontWeight: "bold" } : null}>
                        {names.map((entry, index) => (
                          <span
                            key={`${entry.name}-${index}`}
                            style={entry.overLimit  { color: "#c0392b" } : null}
                          >
                            {entry.name}
                            {index < names.length - 1  ", " : ""}
                          </span>
                        ))}{" "}
                        absent(s)
                      </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-page" style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h2>Tableau de bord gérant</h2>
        <button onClick={onLogout}>Se dÃ©connecter</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() =>
            fetchRequests(viewMode === "calendar")
          }
        >RafraÃ®chir les demandes</button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <button
          onClick={() => setViewMode("list")}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border:
              viewMode === "list"  "2px solid black" : "1px solid #ccc",
               
          }}
        >
          Vue liste
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border:
              viewMode === "calendar"  "2px solid black" : "1px solid #ccc",
          }}
        >
          Vue calendrier (hebdomadaire)
        </button>
        <button
          onClick={() => setViewMode("cumules")}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border:
              viewMode === "cumules"  "2px solid black" : "1px solid #ccc",
          }}
        >
          Congés cumulÃ©s
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 10, fontWeight: "bold" }}>{message}</p>
      )}

      {viewMode === "list" && (
        <>
          {filteredRequests.length === 0 && (
            <p style={{ marginTop: 20 }}>Aucune demande pour le moment.</p>
          )}

          <div style={{ marginTop: 20 }}>
            {filteredRequests.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>
                    #{r.id} - {r.title}
                  </strong>
                  <span>
                    Type :{" "}
                    {r.category === "vacation"
                       "Congés"
                      : r.category === "sick_leave"
                       "ArrÃªt maladie"
                      : r.category || "-"}
                  </span>
                </div>
                <p>
                  <b>EmployÃ© :</b> {r.worker_name} ({r.worker_email})
                  <br />
                  <b>Secteur :</b> {r.sector || "-"} <br />
                  <b>Du :</b> {r.start_date} <b>au</b> {r.end_date}
                </p>
                <p>
                  <b>Raison :</b> {r.reason || "-"}
                </p>
                {r.attachment_name && (
                  <p>
                    <b>PiÃ¨ce jointe :</b>{" "}
                    <button
                      type="button"
                      onClick={() => downloadAttachment(r.id, r.attachment_name)}
                    >
                      TÃ©lÃ©charger
                    </button>
                  </p>
                )}
                <p>
                  <b>Statut :</b>{" "}
                  <select
                    value={r.status}
                    onChange={(e) =>
                      handleChangeField(r.id, "status", e.target.value)
                    }
                  >
                    <option value="nouvelle">Nouvelle</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminÃ©e">TerminÃ©e</option>
                    <option value="refusÃ©e">RefusÃ©e</option>
                  </select>
                </p>
                <p>
                  <b>Commentaire gérant :</b>
                  <br />
                  <textarea
                    rows={3}
                    style={{ width: "100%" }}
                    value={r.manager_comment || ""}
                    onChange={(e) =>
                      handleChangeField(r.id, "manager_comment", e.target.value)
                    }
                  />
                </p>
                <button onClick={() => saveRequest(r.id)}>Enregistrer</button>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === "calendar" && renderWeeklyCalendar()}

      {viewMode === "cumules" && (
        <>
          <AdminCumules token={token} onSelectEmployee={openHistory} />

          {historyFor && (
            <div
              style={{
                marginTop: 16,
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  Historique des demandes â€” {historyFor}
                </h3>
                <button
                  onClick={() => {
                    setHistoryFor(null);
                    setHistoryRows([]);
                  }}
                >
                  Fermer
                </button>
              </div>

              {historyRows.length === 0  (
                <p style={{ marginTop: 8 }}>Aucune demande enregistrÃ©e.</p>
              ) : (
                <ul style={{ marginTop: 8 }}>
                  {historyRows.map((r) => (
                    <li key={r.id} style={{ marginBottom: 6 }}>
                      <b>#{r.id}</b> â€”{" "}
                      {r.category === "vacation"
                         "Congés"
                        : r.category === "sick_leave"
                         "ArrÃªt maladie"
                        : r.category}
                      {" : "}du <b>{r.start_date}</b> au <b>{r.end_date}</b> â€”
                      statut <b>{r.status}</b>
                      {r.reason  ` â€” raison: ${r.reason}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ================== APP PRINCIPALE ==================
export default function App() {
  const [view, setView] = useState(null); // null | "worker" | "loginAdmin" | "admin"
  const [worker, setWorker] = useState(null);
  const [token, setToken] = useState(null);

  const handleWorkerLogin = (w) => {
    setWorker(w);
    setView("worker");
  };

  const handleSelectWorker = () => {
    setToken(null);
    setView("worker");
  };

  const handleSelectAdmin = () => {
    setWorker(null);
    setView("loginAdmin");
  };

  const handleGoHome = () => {
    setWorker(null);
    setToken(null);
    setView(null);
  };

  const handleAdminLogin = (t) => {
    setToken(t);
    setView("admin");
  };

  const handleLogoutAdmin = () => {
    setToken(null);
    setView("loginAdmin");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand-mark" type="button" onClick={handleGoHome}>
          <img
            className="brand-logo"
            src={logoFjord}
            alt="Logo Fjord King"
          />
          <h1 className="brand">Fjord King Demandes</h1>
        </button>
      </header>

      {view === null && (
        <div className="card entry-choice">
          <h2 style={{ textAlign: "center", marginTop: 0 }}>
            Vous Ãªtes 
          </h2>
          <div className="entry-actions">
            <button onClick={handleSelectWorker}>Travailleur</button>
            <button onClick={handleSelectAdmin}>Gérant</button>
          </div>
        </div>
      )}

      {view === "worker" && (
        <>
          {!worker && <WorkerLogin onLogin={handleWorkerLogin} />}
          {worker && <WorkerArea worker={worker} />}
        </>
      )}

      {view === "loginAdmin" && !token && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {view === "admin" && token && (
        <AdminDashboard token={token} onLogout={handleLogoutAdmin} />
      )}
    </div>
  );
}



