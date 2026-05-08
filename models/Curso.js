const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  descricao: { type: String, default: '' },
  ativo:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Curso', cursoSchema);
