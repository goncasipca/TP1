const mongoose = require('mongoose');

const fichaAlunoSchema = new mongoose.Schema({
  aluno_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true, unique: true },
  data_nascimento: { type: String },
  genero:          { type: String, enum: ['M', 'F', 'Outro'] },
  telefone:        { type: String },
  nif:             { type: String },
  morada:          { type: String },
  cp:              { type: String },
  localidade:      { type: String },
  foto:            { type: String, default: null },
  estado:          { type: String, enum: ['pendente', 'aprovada', 'rejeitada'], default: 'pendente' },
  observacoes:     { type: String, default: '' },
  gestor_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', default: null },
  data_validacao:  { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('FichaAluno', fichaAlunoSchema);
