var express = require('express');
var router = express.Router();
const url = "https://glorious-orbit-5gv664r6pv72p4qw-4200.app.github.dev/pontos/"

/* GET pontos listing. */
router.get('/', function (req, res, next) {
  const token = req.session.token || ""
  fetch(url, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    } 
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((pontos) => {
      let title = "Gestão de pontos"
      let cols = ["Id", "Nome", "País", "Descrição", "Ações"]
      res.render('layout', {body: 'pages/pontos', title, pontos, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
      
    })
});

// POST new ponto
router.post("/", (req, res) => {
  const { username, pais, descricao } = req.body
  const token = req.session.token || ""
  fetch(url + '/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`

     },
    
    body: JSON.stringify({ username, pais, descricao })
  })
  .then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((ponto) => {
      res.send(ponto)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE ponto
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { username, pais, descricao } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pais, descricao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((ponto) => {
      res.send(ponto)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE ponto
router.delete("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url+id, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((ponto) => {
      res.send(ponto)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET ponto by id
router.get("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url+id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((ponto) => {
      res.send(ponto)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;