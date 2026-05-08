const express        = require('express');
const path           = require('path');
const fs             = require('fs');
const { checkAuth }  = require('../middleware/auth');
const upload         = require('../middleware/upload');
const FichaAluno     = require('../models/FichaAluno');
const Curso          = require('../models/Curso');
const PedidoMatricula = require('../models/PedidoMatricula');
const Pauta          = require('../models/Pauta');

const router = express.Router();
const auth   = checkAuth('aluno');

// ── Dashboard ──────────────────────────────────────────────────────────────
router.get('/dashboard', auth, (req, res) => {
  res.render('aluno/dashboard.html', { titulo: 'Área do Aluno' });
});

// ── Ficha ──────────────────────────────────────────────────────────────────
router.get('/ficha', auth, async (req, res) => {
  const ficha = await FichaAluno.findOne({ aluno_id: req.session.user_id });
  res.render('aluno/ficha.html', {
    titulo: 'Minha Ficha de Aluno',
    ficha,
    sucesso: req.query.sucesso ? 'Dados guardados com sucesso!' : null,
  });
});

router.post('/ficha', auth, upload.single('foto'), async (req, res) => {
  const aluno_id = req.session.user_id;
  const { data_nascimento, genero, telefone, nif, morada, cp, localidade } = req.body;

  try {
    const fichaExistente = await FichaAluno.findOne({ aluno_id });
    let nome_foto = fichaExistente?.foto || null;

    if (req.file) {
      if (nome_foto) {
        const oldPath = path.join(__dirname, '..', 'public', 'uploads', nome_foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      nome_foto = req.file.filename;
    }

    const dados = { data_nascimento, genero, telefone, nif, morada, cp, localidade, foto: nome_foto, estado: 'pendente' };

    if (fichaExistente) {
      await FichaAluno.findOneAndUpdate({ aluno_id }, dados);
    } else {
      await FichaAluno.create({ aluno_id, ...dados });
    }

    res.redirect('/aluno/ficha?sucesso=1');
  } catch (err) {
    console.error(err);
    res.render('aluno/ficha.html', { titulo: 'Minha Ficha de Aluno', erro: 'Erro ao guardar os dados: ' + err.message });
  }
});

// ── Pedidos de Matrícula ───────────────────────────────────────────────────
router.get('/pedido-matricula', auth, async (req, res) => {
  const ficha   = await FichaAluno.findOne({ aluno_id: req.session.user_id });
  const cursos  = await Curso.find({ ativo: true });
  const pedidos = await PedidoMatricula.find({ aluno_id: req.session.user_id })
    .populate('curso_id')
    .sort({ data_pedido: -1 });

  res.render('aluno/pedido-matricula.html', {
    titulo: 'Pedidos de Matrícula',
    ficha,
    cursos,
    pedidos,
    sucesso: req.query.sucesso ? 'Pedido submetido com sucesso!' : null,
  });
});

router.post('/pedido-matricula', auth, async (req, res) => {
  await PedidoMatricula.create({
    aluno_id: req.session.user_id,
    curso_id: req.body.curso_id,
  });
  res.redirect('/aluno/pedido-matricula?sucesso=1');
});

// ── Notas ──────────────────────────────────────────────────────────────────
router.get('/notas', auth, async (req, res) => {
  // Buscar todas as pautas publicadas que tenham avaliação deste aluno
  const pautas = await Pauta.find({
    estado: 'publicada',
    'avaliacoes.aluno_id': req.session.user_id,
  }).populate('uc_id');

  // Aplanar para uma lista de notas
  const notas = pautas.map(p => {
    const av = p.avaliacoes.find(a => a.aluno_id.toString() === req.session.user_id);
    return {
      uc_nome:    p.uc_id.nome,
      ano_letivo: p.ano_letivo,
      epoca:      p.epoca,
      nota:       av.nota,
      observacoes: av.observacoes,
    };
  });

  res.render('aluno/notas.html', { titulo: 'As Minhas Notas', notas });
});

module.exports = router;
