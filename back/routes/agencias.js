var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

// CRIANDO TABELA agencias
db.run(`CREATE TABLE IF NOT EXISTS agencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  cnpj TEXT UNIQUE,
  password TEXT,
  telefone TEXT,
  email TEXT UNIQUE
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela agencias: ', err);
  } else {
    console.log('Tabela agencias criada com sucesso!');
  }
});

/* POST create a new user. */
router.post('/register', verifyJWT, (req, res) => {
  console.log(req.body);
  const { username, cnpj, password, telefone, email } = req.body;

  db.get('SELECT * FROM agencias WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Erro ao buscar empresa:', err);
      return res.status(500).send({ error: 'Erro ao buscar empresa' });
    }
    if (row) {
      console.log("empresa já existe", err);
      return res.status(400).send({ error: 'Nome de empresa já existe' });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log("Erro ao criar o hash da senha", err);
          return res.status(500).send({ error: 'Erro ao criar o hash da senha' });
        } else {
          db.run('INSERT INTO agencias (username, cnpj, password, telefone, email) VALUES (?, ?, ?, ?, ?)', [username, cnpj, hash, telefone, email], (err) => {
            if (err) {
              console.log("Erro ao criar o empresa", err);
              return res.status(500).send({ error: 'Erro ao criar o empresa' });
            } else {
              res.status(201).send({ message: "empresa criado com sucesso" });
            }
          });
        }
      });
    }
  });
});

/* GET agencias listing. */
router.get('/', verifyJWT, function (req, res, next) {
  db.all('SELECT * FROM agencias', (err, agencias) => {
    if (err) {
      console.log("empresas não foram encontrados", err);
      return res.status(500).send({ error: "empresas não encontrados" });
    } else {
      res.status(200).send(agencias);
    }
  });
});

/* GET single user by ID. */
router.get('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM agencias WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('empresa não encontrado', err);
      return res.status(500).json({ error: 'empresa não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'empresa não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT update a user. */
router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { username, cnpj, password, telefone, email } = req.body;
  db.run('UPDATE agencias SET username = ?, cnpj = ?, password = ?, telefone = ?, email = ? WHERE id = ?', [username, cnpj, password, telefone, email, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o empresa', err);
      return res.status(500).json({ error: 'Erro ao atualizar o empresa' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'empresa não encontrado' });
    }
    res.status(200).json({ message: "empresa atualizado com sucesso" });
  });
});

/* PATCH partially update a user. */
router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE agencias SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o empresa parcialmente', err);
      return res.status(500).json({ error: 'Erro ao atualizar o empresa parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'empresa não encontrado' });
    }
    res.status(200).json({ message: "empresa atualizado parcialmente com sucesso" });
  });
});

/* DELETE a user. */
router.delete('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM agencias WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o empresa', err);
      return res.status(500).json({ error: 'Erro ao deletar o empresa' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'empresa não encontrado' });
    }
    res.status(200).json({ message: "empresa deletado com sucesso" });
  });
});

module.exports = router;
