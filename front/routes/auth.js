var express = require('express');
var router = express.Router();


const url = "https://glorious-orbit-5gv664r6pv72p4qw-4200.app.github.dev/auth/login"

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('layout', { body: 'pages/login', title: 'Express', error: ''});
});

//comentario teste
router.post('/', (req, res) => {
    const { username, password } = req.body
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json()
                console.log('err', err)
                throw err
            }
            return res.json()
        })
        .then((data) => {
            console.log('veio', data)
            req.session.token = data.token
            res.redirect('/users')
        })
        .catch((error) => {
            console.log('Erro', error)
            res.render('layout', { body: 'pages/login', title: 'Express', error,})
        })
})

//Rota para logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/'); // ou outra página de erro
        }
        res.redirect('/login');
    });
});

module.exports = router;
