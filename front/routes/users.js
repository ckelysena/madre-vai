var express = require('express');
var router = express.Router();
const url = "https://obscure-space-capybara-4xvv5qp4xqwh7q7x-4200.app.github.dev/users/"

/* GET users listing. */
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
    .then((users) => {
      let title = "Gestão de Usuários"
      let cols = ["Id", "Nome", "Senha", "Email", "Telefone", "Ações"]
      res.render('layout', {body: 'pages/users', title, users, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
      
    })
});

// POST new user
router.post("/", (req, res) => {
  const { username, password, email, phone } = req.body
  const token = req.session.token || ""
  fetch(url + '/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`

     },
    
    body: JSON.stringify({ username, password, email, phone })
  })
  .then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE user
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { username, password, email, phone } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phone })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE user
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
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET user by id
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
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;