var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

// CRIANDO TABELA pacotas
db.run(`CREATE TABLE IF NOT EXISTS pacotas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nomePacote TEXT UNIQUE,
  passagem TEXT,
  localSaida TEXT,
  localDestino TEXT,
  refeicao TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pacotas: ', err);
  } else {
    console.log('Tabela pacotas criada com sucesso!');
  }
});

/* POST create a new user. */
router.post('/register', verifyJWT, (req, res) => {
  console.log(req.body);
  const { nomePacote, passagem, localSaida, localDestino, refeicao } = req.body;

  db.get('SELECT * FROM pacotas WHERE nomePacote = ?', [nomePacote], (err, row) => {
    if (err) {
      console.error('Erro ao buscar pacotes:', err);
      return res.status(500).send({ error: 'Erro ao buscar pacotes' });
    }
    if (row) {
      console.log("pacotes já existe", err);
      return res.status(400).send({ error: 'Nome de pacotes já existe' });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log("Erro ao criar o hash da senha", err);
          return res.status(500).send({ error: 'Erro ao criar o hash da senha' });
        } else {
          db.run('INSERT INTO pacotas (nomePacote, passagem, localSaida, localDestino, refeicao) VALUES (?, ?, ?, ?, ?)', [nomePacote, hash, passagem, localSaida, localDestino, refeicao], (err) => {
            if (err) {
              console.log("Erro ao criar o pacotes", err);
              return res.status(500).send({ error: 'Erro ao criar o pacotes' });
            } else {
              res.status(201).send({ message: "pacotes criado com sucesso" });
            }
          });
        }
      });
    }
  });
});

/* GET pacotas listing. */
router.get('/', verifyJWT, function (req, res, next) {
  db.all('SELECT * FROM pacotas', (err, pacotas) => {
    if (err) {
      console.log("pacotess não foram encontrados", err);
      return res.status(500).send({ error: "pacotess não encontrados" });
    } else {
      res.status(200).send(pacotas);
    }
  });
});

/* GET single user by ID. */
router.get('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM pacotas WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('pacotes não encontrado', err);
      return res.status(500).json({ error: 'pacotes não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'pacotes não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT update a user. */
router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { nomePacote, passagem, localSaida, localDestino, refeicao } = req.body;
  db.run('UPDATE pacotas SET nomePacote = ? , passagem = ? , localSaida = ? , localDestino = ?, refeicao = ? WHERE id = ?', [nomePacote, passagem, localSaida, localDestino, refeicao, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o pacotes', err);
      return res.status(500).json({ error: 'Erro ao atualizar o pacotes' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'pacotes não encontrado' });
    }
    res.status(200).json({ message: "pacotes atualizado com sucesso" });
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

  db.run(`UPDATE pacotas SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o pacotes parcialmente', err);
      return res.status(500).json({ error: 'Erro ao atualizar o pacotes parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'pacotes não encontrado' });
    }
    res.status(200).json({ message: "pacotes atualizado parcialmente com sucesso" });
  });
});

/* DELETE a user. */
router.delete('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM pacotas WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o pacotes', err);
      return res.status(500).json({ error: 'Erro ao deletar o pacotes' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'pacotes não encontrado' });
    }
    res.status(200).json({ message: "pacotes deletado com sucesso" });
  });
});

module.exports = router;
