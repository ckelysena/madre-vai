var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./database/database.db')

// CRIANDO TABELA pacotes
db.run(`CREATE TABLE IF NOT EXISTS pacotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nomePacote TEXT,
  passagem TEXT,
  localSaida TEXT,
  localDestino TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pacotes: ', err);
  } else {
    console.log('Tabela pacotes criada com sucesso!');
  }
});

/* POST create a new pacote. */
router.post('/', (req, res) => {
  console.log(req.body)
  const {nomePacote, passagem, localSaida, localDestino } = req.body
  db.run('INSERT INTO pacotes (nomePacote, passagem, localSaida, localDestino) VALUES (?,?,?,?)', [nomePacote, passagem, localSaida, localDestino], (err) => {
    if (err) {
      console.log("Erro ao criar o pacote", err)
      return res.status(500).send({error: 'Erro ao criar o pacote'})
    } else {
      res.status(201).send({message: "pacote criado com sucesso"})
    }
  })
})

/* GET pacotes listing. */
router.get('/', function(req, res, next) {
  db.all('SELECT * FROM pacotes', (err, pacotes) => {
    if (err) {
      console.log("pacotes não foram encontrados", err)
      return res.status(500).send({error: "pacotes não encontrados"})
    } else {
      res.status(200).send(pacotes)
    }
  })
});

/* GET single pacote by ID. */
router.get('/:id',function(req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM pacotes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('pacote não encontrado', err);
      return res.status(500).json({error: 'pacote não encontrado'});
    }
    if (!row) {
      return res.status(404).json({error: 'pacote não encontrado'});
    }
    res.status(200).json(row);
  });
});

/* PUT update a pacote. */
router.put('/:id', function(req, res, next) {
  const { id } = req.params;
  const { nomePacote, passagem, localSaida, localDestino } = req.body;
  db.run('UPDATE pacotes SET nomePacote = ?, passagem = ?, localSaida = ?, localDestino = ? WHERE id = ?', [nomePacote, passagem, localSaida, localDestino, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o pacote', err);
      return res.status(500).json({error: 'Erro ao atualizar o pacote'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'pacote não encontrado'});
    }
    res.status(200).json({message: "pacote atualizado com sucesso"});
  });
});

/* PATCH partially update a pacote. */
router.patch('/:id', function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para atualização'});
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE pacotes SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o pacote parcialmente', err);
      return res.status(500).json({error: 'Erro ao atualizar o pacote parcialmente'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'pacote não encontrado'});
    }
    res.status(200).json({message: "pacote atualizado parcialmente com sucesso"});
  });
});

/* DELETE a pacote. */
router.delete('/:id', function(req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM pacotes WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao deletar o pacote', err);
      return res.status(500).json({error: 'Erro ao deletar o pacote'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'pacote não encontrado'});
    }
    res.status(200).json({message: "pacote deletado com sucesso"});
  });
});

module.exports = router;
