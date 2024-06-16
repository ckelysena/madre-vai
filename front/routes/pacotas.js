var express = require('express');
var router = express.Router();
const url = "https://cuddly-rotary-phone-7vvv5xjg4jp7fwx79-4200.app.github.dev/pacotas/"

/* GET pacotas listing. */
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
    .then((pacotas) => {
      let title = "Gestão de pacotas"
      let cols = ["Id", "Nome do Pacote", "Passagem", "Local de Saida", "Local de Destino", "Refeicao", "Ações"]
      res.render('layout', {body: 'pages/pacotas', title, pacotas, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
      
    })
});

// POST new pacota
router.post("/", (req, res) => {
  const { nomePacote, passagem, localSaida, localDestino, refeicao} = req.body
  const token = req.session.token || ""
  fetch(url + '/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`

     },
    
    body: JSON.stringify({ nomePacote, passagem, localSaida, localDestino, refeicao })
  })
  .then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacota) => {
      res.send(pacota)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE pacota
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { nomePacote, passagem, localSaida, localDestino, refeicao } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomePacote, passagem, localSaida, localDestino, refeicao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pacota) => {
      res.send(pacota)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE pacota
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
    .then((pacota) => {
      res.send(pacota)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET pacota by id
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
    .then((pacota) => {
      res.send(pacota)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;