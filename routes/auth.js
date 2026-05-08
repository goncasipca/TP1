const express    = require('express');
const bcrypt     = require('bcryptjs');
const Utilizador = require('../models/Utilizador');
const { checkAuth } = require('../middleware/auth');

const router = express.Router();

// ── GET / ─────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  if (req.session.user_id) return res.redirect(`/${req.session.role}/dashboard`);
  res.render('login.html', { titulo: 'Bem-vindo — AcademiaDigital' });
});

// ── GET /login ────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.user_id) return res.redirect(`/${req.session.role}/dashboard`);
  res.render('login.html', { titulo: 'Aceder ao Portal' });
});

// ── POST /login ───────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Utilizador.findOne({ username, ativo: true });
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.user_id = user._id.toString();
      req.session.role    = user.perfil;
      req.session.name    = user.nome;
      return res.redirect(`/${user.perfil}/dashboard`);
    }
    res.render('login.html', { titulo: 'Aceder ao Portal', erro: 'Credenciais inválidas ou conta inativa.' });
  } catch (err) {
    console.error(err);
    res.render('login.html', { titulo: 'Aceder ao Portal', erro: 'Erro interno.' });
  }
});

// ── GET /logout ───────────────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ── GET /register ─────────────────────────────────────────────────────────────
router.get('/register', checkAuth('gestor'), (req, res) => {
  res.render('register.html', { titulo: 'Registar Utilizador' });
});

// ── POST /register ────────────────────────────────────────────────────────────
router.post('/register', checkAuth('gestor'), async (req, res) => {
  const { nome, email, username, password, perfil } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 12);
    await Utilizador.create({ nome, email, username, password_hash, perfil });
    res.render('register.html', { titulo: 'Registar Utilizador', sucesso: 'Utilizador registado com sucesso!' });
  } catch (err) {
    res.render('register.html', { titulo: 'Registar Utilizador', erro: 'Erro: Nome de utilizador ou email já existem.' });
  }
});

module.exports = router;
