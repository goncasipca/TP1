const express           = require('express');
const { checkAuth }     = require('../middleware/auth');
const PedidoMatricula   = require('../models/PedidoMatricula');
const UnidadeCurricular = require('../models/UnidadeCurricular');
const Pauta             = require('../models/Pauta');
const PlanoEstudo       = require('../models/PlanoEstudo');
const Utilizador        = require('../models/Utilizador');

const router = express.Router();
const auth   = checkAuth('funcionario');

// ── Dashboard ───────────────────────────────────────────────────────────────
router.get('/dashboard', auth, (req, res) => {
  res.render('funcionario/dashboard.html', { titulo: 'Área do Funcionário' });
});

// ── Pedidos Pendentes ────────────────────────────────────────────────────────
router.get('/pedidos-pendentes', auth, async (req, res) => {
  const pedidos = await PedidoMatricula.find({ estado: 'pendente' })
    .populate('aluno_id', 'nome')
    .populate('curso_id', 'nome')
    .sort({ data_pedido: 1 });

  res.render('funcionario/pedidos-pendentes.html', {
    titulo: 'Análise de Matrículas',
    pedidos,
    sucesso: req.query.sucesso ? 'Operação realizada com sucesso!' : null,
  });
});

router.post('/pedidos-pendentes', auth, async (req, res) => {
  const { pedido_id, acao } = req.body;
  const estado = acao === 'aprovar' ? 'aprovada' : 'rejeitada';
  try {
    await PedidoMatricula.findByIdAndUpdate(pedido_id, {
      estado,
      data_validacao:  new Date(),
      funcionario_id:  req.session.user_id,
    });
    res.redirect('/funcionario/pedidos-pendentes?sucesso=1');
  } catch (err) {
    const pedidos = await PedidoMatricula.find({ estado: 'pendente' })
      .populate('aluno_id', 'nome').populate('curso_id', 'nome');
    res.render('funcionario/pedidos-pendentes.html', {
      titulo: 'Análise de Matrículas', pedidos, erro: err.message,
    });
  }
});

// ── Pautas ───────────────────────────────────────────────────────────────────
router.get('/pautas', auth, async (req, res) => {
  const ucs    = await UnidadeCurricular.find().sort({ nome: 1 });
  const pautas = await Pauta.find().populate('uc_id', 'nome').sort({ createdAt: -1 });

  let msg = {};
  if (req.query.sucesso)   msg.sucesso   = 'Operação realizada com sucesso!';
  if (req.query.eliminada) msg.eliminada = 'Pauta eliminada permanentemente.';
  if (req.query.erro === 'nao_permitido')
    msg.erro = 'Não é possível eliminar uma pauta que já foi publicada.';

  res.render('funcionario/pautas.html', { titulo: 'Gestão de Pautas', ucs, pautas, ...msg });
});

router.post('/pautas', auth, async (req, res) => {
  const { uc_id, ano_letivo, epoca } = req.body;
  await Pauta.create({ uc_id, ano_letivo, epoca, funcionario_id: req.session.user_id });
  res.redirect('/funcionario/pautas?sucesso=1');
});

// ── Pauta Editar ─────────────────────────────────────────────────────────────
router.get('/pauta-editar/:id', auth, async (req, res) => {
  const pauta = await Pauta.findById(req.params.id).populate('uc_id');
  if (!pauta) return res.redirect('/funcionario/pautas');

  // Alunos com matrícula aprovada num curso que tem esta UC no plano
  const planos = await PlanoEstudo.find({ uc_id: pauta.uc_id._id });
  const curso_ids = planos.map(p => p.curso_id);

  const pedidosAprovados = await PedidoMatricula.find({
    curso_id: { $in: curso_ids },
    estado: 'aprovada',
  }).populate('aluno_id', 'nome');

  // Remover duplicados de alunos
  const alunosMap = {};
  pedidosAprovados.forEach(p => { alunosMap[p.aluno_id._id] = p.aluno_id; });
  const lista_alunos = Object.values(alunosMap);

  // Mapa de avaliações já lançadas
  const notas = {};
  pauta.avaliacoes.forEach(a => { notas[a.aluno_id.toString()] = a; });

  res.render('funcionario/pauta-editar.html', {
    titulo:      `Lançamento: ${pauta.uc_id.nome}`,
    info:        pauta,
    lista_alunos,
    notas,
    pauta_id:    pauta._id,
    sucesso:     req.query.sucesso ? 'Notas guardadas com sucesso!' : null,
  });
});

router.post('/pauta-editar/:id', auth, async (req, res) => {
  const pauta = await Pauta.findById(req.params.id);
  if (!pauta) return res.redirect('/funcionario/pautas');

  const { notas, obs, finalizar } = req.body;

  if (notas) {
    for (const [aluno_id, nota] of Object.entries(notas)) {
      const observacoes = obs?.[aluno_id] || '';
      const idx = pauta.avaliacoes.findIndex(a => a.aluno_id.toString() === aluno_id);
      if (idx >= 0) {
        pauta.avaliacoes[idx].nota        = nota;
        pauta.avaliacoes[idx].observacoes = observacoes;
      } else {
        pauta.avaliacoes.push({ aluno_id, nota, observacoes });
      }
    }
  }

  if (finalizar !== undefined) pauta.estado = 'publicada';
  await pauta.save();

  res.redirect(`/funcionario/pauta-editar/${pauta._id}?sucesso=1`);
});

// ── Pauta Eliminar ────────────────────────────────────────────────────────────
router.get('/pauta-eliminar/:id', auth, async (req, res) => {
  const pauta = await Pauta.findById(req.params.id);
  if (pauta && pauta.estado === 'rascunho') {
    await Pauta.findByIdAndDelete(req.params.id);
    return res.redirect('/funcionario/pautas?eliminada=1');
  }
  res.redirect('/funcionario/pautas?erro=nao_permitido');
});

module.exports = router;
