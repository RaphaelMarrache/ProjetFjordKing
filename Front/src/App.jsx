import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function RequestForm() {
  const [form, setForm] = useState({
    worker_name: "",
    worker_email: "",
    department: "",
    title: "",
    description: "",
    category: "",
    urgency: "normal",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE}/requests`, form);
      setMessage(`Demande envoyée ! Numéro: ${res.data.id}`);
      // reset
      setForm({
        worker_name: "",
        worker_email: "",
        department: "",
        title: "",
        description: "",
        category: "",
        urgency: "normal",
      });
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Soumettre une demande (travailleur)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input
            type="text"
            name="worker_name"
            value={form.worker_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email :
          <input
            type="email"
            name="worker_email"
            value={form.worker_email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Service / Département :
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Titre de la demande :
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Catégorie :
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Urgence :
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
          >
            <option value="faible">Faible</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <br />
        <label>
          Description :
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>
        <br />
        <button type="submit">Envoyer la demande</button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Connexion gérant</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur :
          <input
            type="text"
            name="username"
            value={login.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Mot de passe :
          <input
            type="password"
            name="password"
            value={login.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

function AdminDashboard({ token }) {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors du chargement des demandes.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveRequest = async (id) => {
    const req = requests.find((r) => r.id === id);
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
      setMessage(`Demande ${id} mise à jour.`);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Tableau de bord gérant</h2>
      <button onClick={fetchRequests}>Rafraîchir</button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
      <div style={{ marginTop: 20 }}>
        {requests.length === 0 && <p>Aucune demande pour l'instant.</p>}
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
            <strong>#{r.id} - {r.title}</strong>
            <p>
              <b>De :</b> {r.worker_name} ({r.worker_email})<br />
              <b>Département :</b> {r.department || "-"} <br />
              <b>Catégorie :</b> {r.category || "-"} <br />
              <b>Urgence :</b> {r.urgency} <br />
              <b>Statut :</b>{" "}
              <select
                value={r.status}
                onChange={(e) =>
                  handleFieldChange(r.id, "status", e.target.value)
                }
              >
                <option value="nouvelle">Nouvelle</option>
                <option value="en_cours">En cours</option>
                <option value="terminée">Terminée</option>
                <option value="refusée">Refusée</option>
              </select>
            </p>
            <p>
              <b>Description :</b><br />
              {r.description}
            </p>
            <p>
              <b>Commentaire gérant :</b><br />
              <textarea
                value={r.manager_comment || ""}
                onChange={(e) =>
                  handleFieldChange(r.id, "manager_comment", e.target.value)
                }
                rows={3}
                style={{ width: "100%" }}
              />
            </p>
            <button onClick={() => saveRequest(r.id)}>Enregistrer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState("public"); // "public" | "login" | "dashboard"
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (t) => {
    setToken(t);
    setView("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    setView("public");
  };

  return (
    <div>
      <header
        style={{
          padding: 10,
          borderBottom: "1px solid #ddd",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <button onClick={() => setView("public")}>Formulaire travailleur</button>
          <button onClick={() => setView("login")} style={{ marginLeft: 10 }}>
            Accès gérant
          </button>
        </div>
        {token && (
          <button onClick={handleLogout}>
            Se déconnecter
          </button>
        )}
      </header>

      {view === "public" && <RequestForm />}
      {view === "login" && !token && <AdminLogin onLogin={handleLoginSuccess} />}
      {view === "dashboard" && token && <AdminDashboard token={token} />}
    </div>
  );
}

export default App;
