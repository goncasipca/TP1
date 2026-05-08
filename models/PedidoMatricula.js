const mongoose = require('mongoose');

const pedidoMatriculaSchema = new mongoose.Schema({
  aluno_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true },
  curso_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
  estado:         { type: String, enum: ['pendente', 'aprovada', 'rejeitada'], default: 'pendente' },
  data_pedido:    { type: Date, default: Date.now },
  data_validacao: { type: Date, default: null },
  funcionario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', default: null },
}, { timestamps: true });

module.exports = mongoose.model('PedidoMatricula', pedidoMatriculaSchema);
