import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. On lit la base de données
    const usersDB = JSON.parse(localStorage.getItem("usersDB") || "[]");
    
    // 2. On cherche si l'utilisateur existe
    const user = usersDB.find(u => u.username === username && u.password === password);

    if (user) {
      onLogin(user); // Connexion réussie ! On passe l'objet utilisateur
    } else {
      setError("Identifiant ou mot de passe incorrect !");
    }
  };

  // ... (Garde exactement le même 'return' et le même 'styles' que je t'ai donné tout à l'heure)
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔒 SIEM Portal</h2>
        <p style={styles.subtitle}>Veuillez vous authentifier</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Se connecter</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f6f8" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { textAlign: "center", margin: "0 0 10px 0", color: "#2c3e50" },
  subtitle: { textAlign: "center", color: "#7f8c8d", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#34495e" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" },
  button: { padding: "12px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" },
  error: { color: "#e74c3c", fontSize: "14px", textAlign: "center", margin: "0" }
};
export default Login;