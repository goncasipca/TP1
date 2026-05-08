const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gestao_academica';
    await mongoose.connect(uri);
    console.log(`✅  MongoDB ligado: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌  Erro ao ligar ao MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
