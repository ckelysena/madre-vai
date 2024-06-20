var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

// CRIANDO TABELA pontos
db.run(`CREATE TABLE IF NOT EXISTS pontos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  pais TEXT,
  descricao TEXT 
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pontos: ', err);
  } else {
    console.log('Tabela pontos criada com sucesso!');
  }
});

/* POST create a new user. */
router.post('/register', verifyJWT, (req, res) => {
  console.log(req.body);
  const { username, pais, descricao } = req.body;

  db.get('SELECT * FROM pontos WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Erro ao buscar ponto:', err);
      return res.status(500).send({ error: 'Erro ao buscar ponto' });
    }
    if (row) {
      console.log("ponto já existe", err);
      return res.status(400).send({ error: 'Nome de ponto já existe' });
    } else {
      db.run('INSERT INTO pontos (username, pais, descricao) VALUES (?, ?, ?)', [username, pais, descricao], (err) => {
        if (err) {
          console.log("Erro ao criar o ponto", err);
          return res.status(500).send({ error: 'Erro ao criar o ponto' });
        } else {
          res.status(201).send({ message: "ponto criado com sucesso" });
        }
      });
    }
  });
});

/* GET pontos listing. */
router.get('/', verifyJWT, function (req, res, next) {
  db.all('SELECT * FROM pontos', (err, pontos) => {
    if (err) {
      console.log("pontos não foram encontrados", err);
      return res.status(500).send({ error: "pontos não encontrados" });
    } else {
      res.status(200).send(pontos);
    }
  });
});

/* GET single user by ID. */
router.get('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM pontos WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('ponto não encontrado', err);
      return res.status(500).json({ error: 'ponto não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'ponto não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT update a user. */
router.put('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  const { username, pais, descricao } = req.body;
  db.run('UPDATE pontos SET username = ?, pais = ?, descricao = ? WHERE id = ?', [username, pais, descricao, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o ponto', err);
      return res.status(500).json({ error: 'Erro ao atualizar o ponto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'ponto não encontrado' });
    }
    res.status(200).json({ message: "ponto atualizado com sucesso" });
  });
});

/* PATCH partially update a user. */
router.patch('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE pontos SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o ponto parcialmente', err);
      return res.status(500).json({ error: 'Erro ao atualizar o ponto parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'ponto não encontrado' });
    }
    res.status(200).json({ message: "ponto atualizado parcialmente com sucesso" });
  });
});

/* DELETE a user. */
router.delete('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM pontos WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o ponto', err);
      return res.status(500).json({ error: 'Erro ao deletar o ponto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'ponto não encontrado' });
    }
    res.status(200).json({ message: "ponto deletado com sucesso" });
  });
});

module.exports = router;
