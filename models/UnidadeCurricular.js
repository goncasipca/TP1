const mongoose = require('mongoose');

const ucSchema = new mongoose.Schema({
  codigo:    { type: String, required: true, unique: true },
  nome:      { type: String, required: true },
  descricao: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('UnidadeCurricular', ucSchema);
