// Importa o Express, Body-Parser e FS
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'data.json');

// Permite receber JSON
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://projeto-notas-seven.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Função para ler arquivo
function readNotes() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Função para salvar arquivo
function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// ====================
// GET - Rota inicial
// ====================
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de notas funcionando!',
    endpoints: {
      listar: 'GET /api/notes',
      criar: 'POST /api/notes',
      atualizar: 'PUT /api/notes/:id',
      deletar: 'DELETE /api/notes/:id'
    }
  });
});

// ====================
// GET - Listar notas
// ====================
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// ====================
// POST - Criar nota
// ====================
app.post('/api/notes', (req, res) => {
  const notes = readNotes();

  const novaNota = {
    id: Date.now().toString(),
    titulo: req.body.titulo,
    texto: req.body.texto,
    tag: req.body.tag || null
  };

  notes.push(novaNota);
  saveNotes(notes);

  res.json(novaNota);
});

// ====================
// PUT - Editar nota
// ====================
app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();

  const index = notes.findIndex(n => n.id === req.params.id);

  if (index >= 0) {
    notes[index].titulo = req.body.titulo;
    notes[index].texto = req.body.texto;
    notes[index].tag = req.body.tag || notes[index].tag || null;

    saveNotes(notes);
    res.json(notes[index]);
  } else {
    res.status(404).json({ erro: 'Nota não encontrada' });
  }
});

// ====================
// DELETE - Excluir nota
// ====================
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();

  const novasNotas = notes.filter(n => n.id !== req.params.id);

  saveNotes(novasNotas);

  res.json({ mensagem: 'Nota removida' });
});

// ====================
// Inicia servidor
// ====================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;