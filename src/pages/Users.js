import React, { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Charger la base de données
    const db = JSON.parse(localStorage.getItem("usersDB") || "[]");
    setUsers(db);
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const newUser = {
      id: Date.now(), // Un ID unique généré par la date
      username: newUsername,
      password: newPassword,
      role: "viewer" // Par défaut, un simple lecteur
    };

    const updatedDB = [...users, newUser];
    setUsers(updatedDB);
    localStorage.setItem("usersDB", JSON.stringify(updatedDB));
    setNewUsername("");
    setNewPassword("");
  };

  const handleDelete = (idToRemove) => {
    const updatedDB = users.filter(u => u.id !== idToRemove);
    setUsers(updatedDB);
    localStorage.setItem("usersDB", JSON.stringify(updatedDB));
  };

  return (
    <div>
      <div className="section-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        <p className="subtitle">Ajouter ou supprimer des accès au dashboard</p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Formulaire d'ajout */}
        <div className="card" style={{ flex: 1, padding: "20px", backgroundColor: "var(--card-bg)", borderRadius: "8px" }}>
          <h3>Créer un utilisateur</h3>
          <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
            <input type="text" placeholder="Nom d'utilisateur" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="monitoring-filters" required />
            <input type="text" placeholder="Mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="monitoring-filters" required />
            <button type="submit" style={{ padding: "10px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              + Ajouter
            </button>
          </form>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="table-container" style={{ flex: 2 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: "bold" }}>{user.username}</td>
                  <td><span className="badge normal">{user.role}</span></td>
                  <td>
                    {user.role !== "admin" ? (
                      <button onClick={() => handleDelete(user.id)} style={{ padding: "5px 10px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Supprimer</button>
                    ) : <span style={{ color: "gray", fontSize: "0.8rem" }}>Admin intouchable</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;