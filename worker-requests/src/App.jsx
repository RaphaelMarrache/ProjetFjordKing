
import axios from "axios";
import React, { useState, useEffect } from "react";


const API_BASE = "http://127.0.0.1:8000"; // backend FastAPI

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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Identification travailleur</h2>
      <p style={{ fontSize: 14, color: "#555" }}>
        Entrez votre identifiant <b>"Nom Prenom"</b> et votre code.
      </p>
      <form onSubmit={handleSubmit}>
        <label>Identifiant (Nom Prenom) :</label>
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

// ================== FORMULAIRE CONGÉS ==================
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
      setMessage(`✅ Demande de congés envoyée (ID : ${res.data.id})`);
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l’envoi de la demande de congés");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h3>Demande de congés</h3>
      <p>
        Employé : <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>
      <form onSubmit={handleSubmit}>
        <label>Date de début :</label>
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
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ================== FORMULAIRE ARRÊT MALADIE ==================
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

    const payload = {
      worker_name: worker.full_name,
      worker_email: worker.email,
      sector: worker.sector,
      category: "sick_leave",
      start_date: form.startDate,
      end_date: form.endDate,
      reason: form.reason || null,
      title: "Congé maladie",
      description,
      urgency: "normal",
    };

    try {
      const res = await axios.post(`${API_BASE}/requests`, payload);
      setMessage(`✅ Congé maladie envoyé (ID : ${res.data.id})`);
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l’envoi du congé maladie");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h3>Demande d'arrêt maladie</h3>
      <p>
        Employé : <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>
      <form onSubmit={handleSubmit}>
        <label>Date de début :</label>
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

        <label>Photo de l’arrêt maladie (prototype) :</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Envoyer l'arrêt maladie
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontWeight: "bold",
            color: message.startsWith("✅") ? "green" : "red",
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
      try {
        const res = await axios.get(`${API_BASE}/worker/requests`, {
        params: { full_name: worker.full_name, email: worker.email },
      });
      setRequests(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement des demandes");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [worker]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (requests.length === 0) return <p>Aucune demande enregistrée pour l’instant.</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Mes demandes</h3>
      {requests.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, marginBottom: 10 }}>
          <p style={{ margin: 0 }}>
            <b>Type :</b>{" "}
            {r.category === "vacation" ? "Congés" : r.category === "sick_leave" ? "Arrêt maladie" : r.category}
          </p>
          <p style={{ margin: "6px 0" }}>
            <b>Du :</b> {r.start_date} <b>au</b> {r.end_date}
          </p>
          <p style={{ margin: 0 }}>
            <b>Statut :</b>{" "}
            <span style={{ color: r.status === "terminée" ? "green" : r.status === "refusée" ? "red" : "orange", fontWeight: "bold" }}>
              {r.status}
            </span>
          </p>
          {r.manager_comment && <p style={{ marginTop: 6 }}><b>Commentaire du gérant :</b> {r.manager_comment}</p>}
        </div>
      ))}
    </div>
  );
}

function WorkerArea({ worker }) {
  const [tab, setTab] = useState(null); // null | "vacation" | "sick" | "mes_demandes"

  if (!worker) {
    return <p style={{ textAlign: "center" }}>Erreur : aucun travailleur connecté.</p>;
  }

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        Connecté en tant que <b>{worker.full_name}</b> (secteur {worker.sector})
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10, marginBottom: 20 }}>
        <button
          onClick={() => setTab("vacation")}
          style={{ padding: "8px 16px", borderRadius: 4, border: tab === "vacation" ? "2px solid black" : "1px solid #ccc",
                   backgroundColor: tab === "vacation" ? "#f0f0f0" : "white" }}>
          Congés
        </button>
        <button
          onClick={() => setTab("sick")}
          style={{ padding: "8px 16px", borderRadius: 4, border: tab === "sick" ? "2px solid black" : "1px solid #ccc",
                   backgroundColor: tab === "sick" ? "#f0f0f0" : "white" }}>
          Arrêt maladie
        </button>
        <button
          onClick={() => setTab("mes_demandes")}
          style={{ padding: "8px 16px", borderRadius: 4, border: tab === "mes_demandes" ? "2px solid black" : "1px solid #ccc",
                   backgroundColor: tab === "mes_demandes" ? "#f0f0f0" : "white" }}>
          Mes demandes
        </button>
      </div>

      {!tab && <p style={{ textAlign: "center" }}>Choisissez une action : <b>Congés</b>, <b>Arrêt maladie</b> ou <b>Mes demandes</b>.</p>}

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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
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

// ================== TABLEAU DE BORD GERANT AVEC CALENDRIER HEBDO ==================
function AdminCumules({ token }) {
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
      // on ajoute un champ éditable "edit"
      setRows(res.data.map(r => ({ ...r, edit: r.cumules_excel })));
    } catch (e) {
      console.error(e);
      setMsg("Erreur de chargement des congés cumulés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCumules(); }, []);

  const saveOne = async (full_name, value) => {
    setMsg("");
    try {
      await axios.patch(
        `${API_BASE}/admin/cumules/${encodeURIComponent(full_name)}`,
        { days: Number(value) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`Valeur mise à jour pour ${full_name}`);
      // recharger pour refléter la valeur Excel officielle
      fetchCumules();
    } catch (e) {
      console.error(e);
      setMsg("Erreur lors de l'enregistrement");
    }
  };

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ marginTop: 10 }}>
      {msg && <p style={{ fontWeight: "bold" }}>{msg}</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Employé</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Secteur</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Cumulé (Excel)</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Cumulé calculé (info)</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Modifier</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.full_name}>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.full_name}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.sector || "-"}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.cumules_excel}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.cumules_calc}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                  <input
                    type="number"
                    value={r.edit}
                    onChange={(e) =>
                      setRows(prev =>
                        prev.map(x =>
                          x.full_name === r.full_name ? { ...x, edit: e.target.value } : x
                        )
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

      <p style={{ marginTop: 10, fontStyle: "italic" }}>
        “Cumulé (Excel)” est la valeur officielle modifiable par le gérant.
        “Cumulé calculé (info)” est la somme des congés acceptés (pour contrôle).
      </p>
    </div>
  );
}

function AdminDashboard({ token, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar" | "cumules"


  // semaine courante : on stocke le lundi de la semaine
  const today = new Date();
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay(); // 0 dimanche, 1 lundi, ...
    const diff = (day === 0 ? -6 : 1) - day; // ramène à lundi
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const [weekStart, setWeekStart] = useState(getMonday(today));

  const sectors = ["1", "2", "3", "4", "5"];

  const fetchRequests = async () => {
    setMessage("");
    try {
      const res = await axios.get(`${API_BASE}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors du chargement des demandes");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChangeField = (id, field, value) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveRequest = async (id) => {
    const req = requests.find((r) => r.id === id);
    setMessage("");
    try {
      await axios.patch(
        `${API_BASE}/admin/requests/${id}`,
        {
          status: req.status,
          manager_comment: req.manager_comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Demande ${id} mise à jour`);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour");
    }
  };

  // ---- LISTE classique ----
  const filteredRequests = requests; // tu peux réajouter filtres si tu veux

  // ---- MAP D'ABSENCE par jour + secteur ----
  function buildAbsenceMap() {
    const map = {}; // { "YYYY-MM-DD": { "1": [noms...], "2": [...], ... } }

    requests.forEach((r) => {
      if (r.status !== "terminée") return; // uniquement demandes acceptées
      if (!r.start_date || !r.end_date) return;
      const sector = r.sector || "1";

      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      let current = new Date(start);
      while (current <= end) {
        const key = current.toISOString().slice(0, 10);
        if (!map[key]) map[key] = {};
        if (!map[key][sector]) map[key][sector] = [];
        if (!map[key][sector].includes(r.worker_name)) {
          map[key][sector].push(r.worker_name);
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
          <button onClick={() => changeWeek(-1)}>◀ Semaine précédente</button>
          <strong>
            Semaine du {formatDate(days[0])} au {formatDate(days[6])}
          </strong>
          <button onClick={() => changeWeek(1)}>Semaine suivante ▶</button>
        </div>

        {/* Grille : 1 colonne pour les labels de secteur + 7 colonnes jours */}
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
          {/* Ligne d'en-tête : vide + jours */}
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

          {/* Pour chaque secteur, une ligne + 7 cases */}
          {sectors.map((sec) => (
            <>
              <div
                key={`label-${sec}`}
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

                return (
                  <div
                    key={`cell-${sec}-${idx}`}
                    style={{
                      borderTop: "1px solid #eee",
                      padding: 4,
                      fontSize: 12,
                      minHeight: 40,
                    }}
                  >
                    {names.length === 0 ? (
                      <span style={{ color: "#888" }}>Tous présents</span>
                    ) : (
                      <span>{names.join(", ")} absent(s)</span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        <p style={{ marginTop: 10, fontStyle: "italic" }}>
          Ce calendrier affiche les absences (congés et arrêts maladie) des
          demandes <b>acceptées</b> (statut “terminée”), réparties par secteur.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h2>Tableau de bord gérant</h2>
        <button onClick={onLogout}>Se déconnecter</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={fetchRequests}>Rafraîchir les demandes</button>
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
              viewMode === "list" ? "2px solid black" : "1px solid #ccc",
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
              viewMode === "calendar" ? "2px solid black" : "1px solid #ccc",
          }}
        >
          Vue calendrier (hebdomadaire)
        </button><button
    onClick={() => setViewMode("cumules")}
    style={{ padding: "6px 12px", borderRadius: 4, border: viewMode === "cumules" ? "2px solid black" : "1px solid #ccc" }}
  >
    Congés cumulés
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
                      ? "Congés"
                      : r.category === "sick_leave"
                      ? "Arrêt maladie"
                      : r.category || "-"}
                  </span>
                </div>
                <p>
                  <b>Employé :</b> {r.worker_name} ({r.worker_email})<br />
                  <b>Secteur :</b> {r.sector || "-"} <br />
                  <b>Du :</b> {r.start_date} <b>au</b> {r.end_date}
                </p>
                <p>
                  <b>Raison :</b> {r.reason || "-"}
                </p>
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
                    <option value="terminée">Terminée</option>
                    <option value="refusée">Refusée</option>
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
      {viewMode === "cumules" && <AdminCumules token={token} />}

    </div>
  );
}

// ================== APP PRINCIPALE ==================
export default function App() {
  const [view, setView] = useState("worker"); // "worker" | "loginAdmin" | "admin"
  const [worker, setWorker] = useState(null);
  const [token, setToken] = useState(null);

  const handleWorkerLogin = (w) => {
    setWorker(w);
    setView("worker");
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
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header
  style={{
    padding: 15,
    borderBottom: "1px solid #ddd",
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h1 style={{ margin: 0 }}>Portail RH - Demandes</h1>
  <div>
    <button
      onClick={() => {
        setWorker(null);      // on efface le dernier travailleur
        setView("worker");    // on revient à l’écran d’identification
      }}
    >
      Espace travailleur
    </button>

    <button
      onClick={() => setView(token ? "admin" : "loginAdmin")}
      style={{ marginLeft: 10 }}
    >
      Espace gérant
    </button>
  </div>
</header>


      {/* ESPACE TRAVAILLEUR */}
      {/* ESPACE TRAVAILLEUR */}
{view === "worker" && (
  <>
    {!worker && <WorkerLogin onLogin={handleWorkerLogin} />}
    {worker && <WorkerArea worker={worker} />}
  </>
)}

{/* LOGIN GERANT */}
{view === "loginAdmin" && !token && (
  <AdminLogin onLogin={handleAdminLogin} />
)}

{/* TABLEAU DE BORD GERANT */}
{view === "admin" && token && (
  <AdminDashboard token={token} onLogout={handleLogoutAdmin} />
)}

    </div>
  );
}
