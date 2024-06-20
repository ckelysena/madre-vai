var express = require('express');
var router = express.Router();
const url = "https://musical-winner-5gggr97wpj5jf7q95-4200.app.github.dev/agencias/"

/* GET agencias listing. */
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
    .then((agencias) => {
      let title = "Gestão de Agencias"
      let cols = ["Id", "Nome", "cnpj", "password", "telefone", "email", "Ações"]
      res.render('layout', {body: 'pages/agencias', title, agencias, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
      
    })
});

// POST new agencia
router.post("/", (req, res) => {
  const { username, cnpj, password, telefone, email } = req.body
  const token = req.session.token || ""
  fetch(url + '/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`

     },
    
    body: JSON.stringify({ username, cnpj, password, telefone, email })
  })
  .then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((agencia) => {
      res.send(agencia)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE agencia
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { username, cnpj, password, telefone, email } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, cnpj, password, telefone, email })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((agencia) => {
      res.send(agencia)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE agencia
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
    .then((agencia) => {
      res.send(agencia)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET agencia by id
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
    .then((agencia) => {
      res.send(agencia)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;