var express = require('express');
var router = express.Router();
const url = "https://obscure-space-capybara-4xvv5qp4xqwh7q7x-4200.app.github.dev/pacotes/"

/* GET pacotes listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de pacotes"
  let cols = ["Id", "Nome do Pacote", "Passagem", "Local de Saida", "Local de Destino", "Ações"]
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((pacotes) => {
      res.render('layout', { body: 'pages/pacotes', title, pacotes, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.render('layout', { body: 'pages/pacotes', title: "Gestão de pacotes", error })
    })
});

// POST new pacote
router.post("/", (req, res) => {
  const { nomePacote, passagem, localSaida, localDestino } = req.body
  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nomePacote, passagem, localSaida, localDestino })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacote) => {
      res.send(pacote)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE pacote
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { nomePacote, passagem, localSaida, localDestino } = req.body
  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomePacote, passagem, localSaida, localDestino })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacote) => {
      res.send(pacote)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE pacote
router.delete("/:id", (req, res) => {
  const { id } = req.params
  fetch(url + id, {
    method: "DELETE"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacote) => {
      res.send(pacote)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET pacote by id
router.get("/:id", (req, res) => {
  const { id } = req.params
  fetch(url + id, {
    method: "GET"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacote) => {
      res.send(pacote)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
