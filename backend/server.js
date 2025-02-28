const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("agendamentos.db");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Criar tabela se não existir
db.run(
  `CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    disciplina TEXT,
    laboratorio TEXT,
    data TEXT,
    horario TEXT
  )`
);

// Rota para salvar um agendamento
app.post("/agendar", (req, res) => {
  const { nome, disciplina, laboratorio, data, horario } = req.body;

  db.run(
    "INSERT INTO agendamentos (nome, disciplina, laboratorio, data, horario) VALUES (?, ?, ?, ?, ?)",
    [nome, disciplina, laboratorio, data, horario],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: "Agendamento salvo!" });
    }
  );
});

// Rota para obter todos os agendamentos
app.get("/agendamentos", (req, res) => {
  db.all("SELECT * FROM agendamentos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para excluir um agendamento
app.delete("/agendamentos/:id", (req, res) => {
  db.run("DELETE FROM agendamentos WHERE id = ?", req.params.id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Agendamento excluído!" });
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});
