# AcademiaDigital — Node.js + MongoDB

Versão MongoDB do projeto, usando **Express + Mongoose + Nunjucks**.

## Estrutura

```
academia-digital-mongo/
├── app.js                        # Servidor Express
├── seed.js                       # Script de dados de exemplo
├── .env.example
│
├── config/db.js                  # Ligação MongoDB (Mongoose)
│
├── models/                       # Schemas Mongoose
│   ├── Utilizador.js
│   ├── Curso.js
│   ├── UnidadeCurricular.js
│   ├── PlanoEstudo.js
│   ├── FichaAluno.js
│   ├── PedidoMatricula.js
│   └── Pauta.js                  # Inclui avaliações como subdocumentos
│
├── middleware/
│   ├── auth.js                   # checkAuth(role)
│   └── upload.js                 # Multer
│
├── routes/
│   ├── auth.js                   # login, logout, register
│   ├── aluno.js
│   ├── funcionario.js
│   └── gestor.js
│
├── views/                        # Templates Nunjucks
└── public/css/style.css
```

## Instalação e Arranque

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Popular a base de dados com dados de exemplo
npm run seed

# 4. Iniciar o servidor
npm run dev        # desenvolvimento (auto-reload)
npm start          # produção
```

Aceder em: **http://localhost:3000**

## Credenciais de Exemplo (após seed)

| Perfil | Username | Password |
|---|---|---|
| Gestor | `gestor` | `gestor123` |
| Funcionário | `funcionario` | `func123` |
| Aluno (matriculado) | `carlos` | `aluno123` |
| Aluno (matriculada) | `diana` | `aluno123` |
| Aluno (pendente) | `eduardo` | `aluno123` |

## Decisões de Design MongoDB

| MySQL (versão anterior) | MongoDB |
|---|---|
| Tabela `avaliacoes` separada | Subdocumentos embebidos em `Pauta` |
| JOINs entre tabelas | `.populate()` do Mongoose |
| `id` inteiro auto-increment | `_id` ObjectId |
| Chaves estrangeiras | Referências por ObjectId |
