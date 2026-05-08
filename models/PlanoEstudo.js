const mongoose = require('mongoose');

const planoEstudoSchema = new mongoose.Schema({
  curso_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
  uc_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'UnidadeCurricular', required: true },
  ano:       { type: Number, required: true, min: 1 },
  semestre:  { type: Number, required: true, enum: [1, 2] },
}, { timestamps: true });

// Equivalente ao UNIQUE KEY do MySQL
planoEstudoSchema.index({ curso_id: 1, uc_id: 1, ano: 1, semestre: 1 }, { unique: true });

module.exports = mongoose.model('PlanoEstudo', planoEstudoSchema);
