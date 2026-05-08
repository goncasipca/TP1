require('dotenv').config();
const express    = require('express');
const session    = require('express-session');
const flash      = require('connect-flash');
const nunjucks   = require('nunjucks');
const path       = require('path');
const methodOverride = require('method-override');
const connectDB  = require('./config/db');

const app = express();

// ── Ligar ao MongoDB ──────────────────────────────────────────────────────────
connectDB();

// ── Template Engine (Nunjucks) ────────────────────────────────────────────────
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: true,
});
app.set('view engine', 'html');

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'academia_digital_secret_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 },
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.session     = req.session;
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg   = req.flash('error');
  next();
});

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/',            require('./routes/auth'));
app.use('/aluno',       require('./routes/aluno'));
app.use('/funcionario', require('./routes/funcionario'));
app.use('/gestor',      require('./routes/gestor'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404.html', { titulo: 'Página não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀  AcademiaDigital a correr em http://localhost:${PORT}`);
});
