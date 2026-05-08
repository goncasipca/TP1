/**
 * Script de Seed — AcademiaDigital (MongoDB)
 * Cria dados de exemplo para demonstração do sistema.
 *
 * Uso: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const connectDB           = require('./config/db');
const Utilizador          = require('./models/Utilizador');
const Curso               = require('./models/Curso');
const UnidadeCurricular   = require('./models/UnidadeCurricular');
const PlanoEstudo         = require('./models/PlanoEstudo');
const FichaAluno          = require('./models/FichaAluno');
const PedidoMatricula     = require('./models/PedidoMatricula');
const Pauta               = require('./models/Pauta');

async function seed() {
  await connectDB();

  console.log('\n🗑️   A limpar coleções existentes...');
  await Promise.all([
    Utilizador.deleteMany({}),
    Curso.deleteMany({}),
    UnidadeCurricular.deleteMany({}),
    PlanoEstudo.deleteMany({}),
    FichaAluno.deleteMany({}),
    PedidoMatricula.deleteMany({}),
    Pauta.deleteMany({}),
  ]);

  // ── 1. Utilizadores ────────────────────────────────────────────────────────
  console.log('👤  A criar utilizadores...');
  const hash = (p) => bcrypt.hash(p, 12);

  const [gestor, func1, aluno1, aluno2, aluno3] = await Utilizador.insertMany([
    {
      nome: 'Ana Gestora',
      email: 'gestor@academia.pt',
      username: 'gestor',
      password_hash: await hash('gestor123'),
      perfil: 'gestor',
    },
    {
      nome: 'Bruno Funcionário',
      email: 'funcionario@academia.pt',
      username: 'funcionario',
      password_hash: await hash('func123'),
      perfil: 'funcionario',
    },
    {
      nome: 'Carlos Aluno',
      email: 'carlos@academia.pt',
      username: 'carlos',
      password_hash: await hash('aluno123'),
      perfil: 'aluno',
    },
    {
      nome: 'Diana Aluno',
      email: 'diana@academia.pt',
      username: 'diana',
      password_hash: await hash('aluno123'),
      perfil: 'aluno',
    },
    {
      nome: 'Eduardo Aluno',
      email: 'eduardo@academia.pt',
      username: 'eduardo',
      password_hash: await hash('aluno123'),
      perfil: 'aluno',
    },
  ]);

  // ── 2. Cursos ──────────────────────────────────────────────────────────────
  console.log('🏫  A criar cursos...');
  const [cLicWeb, cLicInfo, cCst] = await Curso.insertMany([
    { nome: 'Licenciatura em Desenvolvimento Web', descricao: 'Formação em tecnologias web modernas.' },
    { nome: 'Licenciatura em Informática de Gestão', descricao: 'Sistemas de informação e gestão empresarial.' },
    { nome: 'Curso Superior Técnico em Cibersegurança', descricao: 'Segurança de sistemas e redes.', ativo: false },
  ]);

  // ── 3. Unidades Curriculares ───────────────────────────────────────────────
  console.log('📚  A criar unidades curriculares...');
  const [ucProg, ucBD, ucWeb, ucRedes, ucAlgo] = await UnidadeCurricular.insertMany([
    { codigo: 'PROG101', nome: 'Programação I', descricao: 'Fundamentos de programação em Python.' },
    { codigo: 'BD201',   nome: 'Bases de Dados', descricao: 'SQL, modelação relacional e NoSQL.' },
    { codigo: 'WEB301',  nome: 'Desenvolvimento Web', descricao: 'HTML, CSS, JavaScript e frameworks.' },
    { codigo: 'REDES101', nome: 'Redes de Computadores', descricao: 'TCP/IP, protocolos e infraestrutura.' },
    { codigo: 'ALG101',  nome: 'Algoritmos e Estruturas de Dados', descricao: 'Complexidade e estruturas fundamentais.' },
  ]);

  // ── 4. Planos de Estudo ────────────────────────────────────────────────────
  console.log('🗺️   A criar planos de estudo...');
  await PlanoEstudo.insertMany([
    // Licenciatura Web
    { curso_id: cLicWeb._id, uc_id: ucProg._id,  ano: 1, semestre: 1 },
    { curso_id: cLicWeb._id, uc_id: ucAlgo._id,  ano: 1, semestre: 2 },
    { curso_id: cLicWeb._id, uc_id: ucBD._id,    ano: 2, semestre: 1 },
    { curso_id: cLicWeb._id, uc_id: ucWeb._id,   ano: 2, semestre: 2 },
    // Licenciatura Informática de Gestão
    { curso_id: cLicInfo._id, uc_id: ucProg._id,  ano: 1, semestre: 1 },
    { curso_id: cLicInfo._id, uc_id: ucBD._id,    ano: 1, semestre: 2 },
    { curso_id: cLicInfo._id, uc_id: ucRedes._id, ano: 2, semestre: 1 },
  ]);

  // ── 5. Fichas de Aluno ─────────────────────────────────────────────────────
  console.log('📋  A criar fichas de aluno...');
  await FichaAluno.insertMany([
    {
      aluno_id: aluno1._id,
      data_nascimento: '2002-03-15',
      genero: 'M', telefone: '912345678', nif: '123456789',
      morada: 'Rua das Flores, 10', cp: '4700-001', localidade: 'Braga',
      estado: 'aprovada', gestor_id: gestor._id, data_validacao: new Date(),
    },
    {
      aluno_id: aluno2._id,
      data_nascimento: '2001-07-22',
      genero: 'F', telefone: '923456789', nif: '987654321',
      morada: 'Avenida Central, 45', cp: '4710-010', localidade: 'Braga',
      estado: 'aprovada', gestor_id: gestor._id, data_validacao: new Date(),
    },
    {
      aluno_id: aluno3._id,
      data_nascimento: '2003-11-05',
      genero: 'M', telefone: '934567890', nif: '111222333',
      morada: 'Travessa do Porto, 7', cp: '4000-001', localidade: 'Porto',
      estado: 'pendente',
    },
  ]);

  // ── 6. Pedidos de Matrícula ────────────────────────────────────────────────
  console.log('📩  A criar pedidos de matrícula...');
  const [pm1, pm2] = await PedidoMatricula.insertMany([
    {
      aluno_id: aluno1._id, curso_id: cLicWeb._id,
      estado: 'aprovada', data_validacao: new Date(), funcionario_id: func1._id,
    },
    {
      aluno_id: aluno2._id, curso_id: cLicWeb._id,
      estado: 'aprovada', data_validacao: new Date(), funcionario_id: func1._id,
    },
    {
      aluno_id: aluno3._id, curso_id: cLicInfo._id,
      estado: 'pendente',
    },
  ]);

  // ── 7. Pautas e Avaliações ─────────────────────────────────────────────────
  console.log('📊  A criar pautas e avaliações...');
  await Pauta.insertMany([
    {
      uc_id: ucProg._id,
      ano_letivo: '2024/2025',
      epoca: 'Normal',
      estado: 'publicada',
      funcionario_id: func1._id,
      avaliacoes: [
        { aluno_id: aluno1._id, nota: 16.5, observacoes: '' },
        { aluno_id: aluno2._id, nota: 12.0, observacoes: '' },
      ],
    },
    {
      uc_id: ucBD._id,
      ano_letivo: '2024/2025',
      epoca: 'Normal',
      estado: 'publicada',
      funcionario_id: func1._id,
      avaliacoes: [
        { aluno_id: aluno1._id, nota: 18.0, observacoes: 'Excelente desempenho.' },
        { aluno_id: aluno2._id, nota: 8.5,  observacoes: 'Recurso recomendado.' },
      ],
    },
    {
      uc_id: ucWeb._id,
      ano_letivo: '2024/2025',
      epoca: 'Normal',
      estado: 'rascunho',
      funcionario_id: func1._id,
      avaliacoes: [],
    },
  ]);

  // ── Resumo ─────────────────────────────────────────────────────────────────
  console.log('\n✅  Seed concluído com sucesso!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  CREDENCIAIS DE ACESSO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Gestor      → gestor / gestor123');
  console.log('  Funcionário → funcionario / func123');
  console.log('  Aluno 1     → carlos / aluno123  (ficha aprovada, matriculado)');
  console.log('  Aluno 2     → diana / aluno123   (ficha aprovada, matriculada)');
  console.log('  Aluno 3     → eduardo / aluno123 (ficha pendente)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
