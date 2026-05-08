const express           = require('express');
const { checkAuth }     = require('../middleware/auth');
const FichaAluno        = require('../models/FichaAluno');
const Curso             = require('../models/Curso');
const UnidadeCurricular = require('../models/UnidadeCurricular');
const PlanoEstudo       = require('../models/PlanoEstudo');

const router = express.Router();
const auth   = checkAuth('gestor');

// ── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard', auth, (req, res) => {
  res.render('gestor/dashboard.html', { titulo: 'Área do Gestor' });
});

// ── Fichas Pendentes ─────────────────────────────────────────────────────────
router.get('/fichas-pendentes', auth, async (req, res) => {
  const fichas = await FichaAluno.find({ estado: 'pendente' }).populate('aluno_id', 'nome');
  res.render('gestor/fichas-pendentes.html', { titulo: 'Validar Fichas', fichas });
});

router.post('/fichas-pendentes', auth, async (req, res) => {
  const { ficha_id, decisao, observacoes } = req.body;
  const estado = decisao === 'aprovar' ? 'aprovada' : 'rejeitada';
  await FichaAluno.findByIdAndUpdate(ficha_id, {
    estado, observacoes,
    gestor_id:      req.session.user_id,
    data_validacao: new Date(),
  });
  res.redirect('/gestor/fichas-pendentes');
});

// ── Cursos ───────────────────────────────────────────────────────────────────
router.get('/cursos', auth, async (req, res) => {
  const cursos = await Curso.find().sort({ nome: 1 });
  res.render('gestor/cursos.html', { titulo: 'Gestão de Cursos', cursos });
});

router.post('/cursos', auth, async (req, res) => {
  await Curso.create({ nome: req.body.nome, descricao: req.body.descricao });
  res.redirect('/gestor/cursos');
});

router.get('/cursos/toggle/:id', auth, async (req, res) => {
  const curso = await Curso.findById(req.params.id);
  if (curso) { curso.ativo = !curso.ativo; await curso.save(); }
  res.redirect('/gestor/cursos');
});

// ── Unidades Curriculares ─────────────────────────────────────────────────────
router.get('/uc', auth, async (req, res) => {
  const ucs = await UnidadeCurricular.find().sort({ codigo: 1 });
  res.render('gestor/uc.html', { titulo: 'Unidades Curriculares', ucs });
});

router.post('/uc', auth, async (req, res) => {
  await UnidadeCurricular.create({ codigo: req.body.codigo, nome: req.body.nome, descricao: req.body.descricao });
  res.redirect('/gestor/uc');
});

// ── Planos de Estudo ──────────────────────────────────────────────────────────
router.get('/planos', auth, async (req, res) => {
  const cursos = await Curso.find({ ativo: true });
  const ucs    = await UnidadeCurricular.find();
  const planos = await PlanoEstudo.find()
    .populate('curso_id', 'nome')
    .populate('uc_id', 'nome')
    .sort({ 'curso_id.nome': 1 });

  res.render('gestor/planos.html', { titulo: 'Planos de Estudo', cursos, ucs, planos });
});

router.post('/planos', auth, async (req, res) => {
  const { curso_id, uc_id, ano, semestre } = req.body;
  try {
    await PlanoEstudo.create({ curso_id, uc_id, ano, semestre });
    res.redirect('/gestor/planos');
  } catch (err) {
    const cursos = await Curso.find({ ativo: true });
    const ucs    = await UnidadeCurricular.find();
    const planos = await PlanoEstudo.find().populate('curso_id', 'nome').populate('uc_id', 'nome');
    res.render('gestor/planos.html', {
      titulo: 'Planos de Estudo', cursos, ucs, planos,
      erro: 'Esta UC já está associada a este ano/semestre do curso.',
    });
  }
});

module.exports = router;
