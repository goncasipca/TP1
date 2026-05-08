const mongoose = require('mongoose');

const utilizadorSchema = new mongoose.Schema({
  nome:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  username:      { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  perfil:        { type: String, enum: ['aluno', 'funcionario', 'gestor'], required: true },
  ativo:         { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Utilizador', utilizadorSchema);
