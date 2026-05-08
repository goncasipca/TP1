const mongoose = require('mongoose');

// Avaliações como subdocumentos embebidos na Pauta
// (em MongoDB faz mais sentido do que uma coleção separada)
const avaliacaoSchema = new mongoose.Schema({
  aluno_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true },
  nota:        { type: Number, min: 0, max: 20, default: null },
  observacoes: { type: String, default: '' },
});

const pautaSchema = new mongoose.Schema({
  uc_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'UnidadeCurricular', required: true },
  ano_letivo:     { type: String, required: true },
  epoca:          { type: String, enum: ['Normal', 'Recurso', 'Especial'], required: true },
  estado:         { type: String, enum: ['rascunho', 'publicada'], default: 'rascunho' },
  funcionario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador' },
  avaliacoes:     [avaliacaoSchema],
}, { timestamps: true });

module.exports = mongoose.model('Pauta', pautaSchema);
