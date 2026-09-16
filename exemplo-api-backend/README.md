# 🚀 API CRUD de Notas com Node.js + Express

## 📌 Sobre o Projeto
Este projeto é uma **API RESTful** desenvolvida com **Node.js** e **Express.js** para gerenciar notas.

Os dados são armazenados em um arquivo local chamado `data.json`, simulando um banco de dados simples.

A aplicação permite criar, listar, buscar, editar e excluir notas através de requisições HTTP.

---

## 🛠️ Tecnologias Utilizadas
- Node.js
- Express.js
- Body-Parser
- File System (`fs`)
- Path
- JSON como armazenamento
- Render (Deploy)

---

## 📁 Estrutura do Projeto

    projeto-notas/
    ├── node_modules/
    ├── package.json
    ├── package-lock.json
    ├── server.js
    └── data.json

---

## 📄 Função de Cada Arquivo

| Arquivo | Função |
|--------|--------|
| server.js | Arquivo principal com servidor e rotas |
| data.json | Armazena as notas em formato JSON |
| package.json | Dependências e scripts do projeto |

---

## ⚙️ Configuração Inicial

### Importação de módulos

    const express = require('express');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const path = require('path');

### O que cada módulo faz:
- **express** → cria o servidor e rotas
- **body-parser** → lê JSON enviado no body
- **fs** → lê e grava arquivos
- **path** → trabalha com caminhos de arquivos

---

## 🚪 Inicialização do Servidor

    const app = express();
    const PORT = process.env.PORT || 3000;

### Explicação:
- Cria a aplicação Express
- Usa a porta do ambiente (Render) ou 3000 localmente

---

## 📂 Arquivo de Dados

    const DATA_FILE = path.join(__dirname, 'data.json');

Define onde as notas serão armazenadas.

---

## 🔄 Middleware JSON

    app.use(bodyParser.json());

Permite receber dados JSON no corpo da requisição.

Exemplo:

    {
      "titulo": "Comprar pão",
      "texto": "Ir na padaria"
    }

---

## 🌍 Middleware CORS

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

Libera acesso da API para aplicações frontend.

---

## 🧠 Funções Auxiliares

### 📖 Ler Notas

    const readNotes = () => {
      try {
        const rawData = fs.readFileSync(DATA_FILE);
        return JSON.parse(rawData);
      } catch (error) {
        return [];
      }
    };

### O que faz:
1. Lê o arquivo `data.json`
2. Converte JSON para array JavaScript
3. Retorna as notas

---

### 💾 Salvar Notas

    const writeNotes = (notes) => {
      fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
    };

Grava todas as notas no arquivo `data.json`.

---

## 📌 Rotas CRUD

### 📥 GET /api/notes

Lista todas as notas.

    app.get('/api/notes', (req, res) => {
      const notes = readNotes();
      res.json(notes);
    });

---

### ➕ POST /api/notes

Cria uma nova nota.

    app.post('/api/notes', (req, res) => {
      const notes = readNotes();
      const { titulo, texto } = req.body;

      if (!titulo || !texto) {
        return res.status(400).json({
          error: 'Título e texto são obrigatórios'
        });
      }

      const newNote = {
        id: Date.now().toString(),
        titulo,
        texto,
        criadoEm: new Date().toISOString()
      };

      notes.push(newNote);
      writeNotes(notes);

      res.status(201).json(newNote);
    });

---

### 🔍 GET /api/notes/:id

Busca uma nota específica pelo ID.

    app.get('/api/notes/:id', (req, res) => {
      const notes = readNotes();
      const note = notes.find(n => n.id === req.params.id);

      if (!note) {
        return res.status(404).json({
          error: 'Nota não encontrada'
        });
      }

      res.json(note);
    });

---

### ✏️ PUT /api/notes/:id

Atualiza uma nota existente.

    app.put('/api/notes/:id', (req, res) => {
      const notes = readNotes();
      const index = notes.findIndex(n => n.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          error: 'Nota não encontrada'
        });
      }

      const { titulo, texto } = req.body;

      if (!titulo || !texto) {
        return res.status(400).json({
          error: 'Título e texto são obrigatórios'
        });
      }

      notes[index] = {
        ...notes[index],
        titulo,
        texto
      };

      writeNotes(notes);
      res.json(notes[index]);
    });

---

### 🗑️ DELETE /api/notes/:id

Remove uma nota.

    app.delete('/api/notes/:id', (req, res) => {
      let notes = readNotes();
      const initialLength = notes.length;

      notes = notes.filter(note => note.id !== req.params.id);

      if (notes.length === initialLength) {
        return res.status(404).json({
          error: 'Nota não encontrada'
        });
      }

      writeNotes(notes);
      res.status(204).send();
    });

---

## ▶️ Inicialização do Servidor

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      if (!fs.existsSync(DATA_FILE)) {
        writeNotes([]);
      }
    });

Ao iniciar:
- Liga o servidor
- Exibe a porta no terminal
- Cria `data.json` se não existir

---

## 💻 Como Executar

### Instalar dependências

    npm install

### Rodar projeto

    npm start

ou

    node server.js

---

## 🌐 URL Local

    http://localhost:3000

---

## 📬 Endpoints Resumo

| Método | Rota | Função |
|--------|------|--------|
| GET | /api/notes | Listar tudo |
| GET | /api/notes/:id | Buscar uma |
| POST | /api/notes | Criar |
| PUT | /api/notes/:id | Atualizar |
| DELETE | /api/notes/:id | Excluir |

---

## ⚠️ Limitações do Projeto
Por usar arquivo JSON:

- Não escala bem
- Sem autenticação
- Sem múltiplos usuários
- Risco de conflito em escrita
- Não ideal para produção grande

---

## 🚀 Melhorias Futuras
- MongoDB / MySQL
- Autenticação JWT
- Validação com Joi/Zod
- Separar rotas/controllers
- Logs de erro
- Testes automatizados

---

## 🎯 Objetivo Educacional
Ideal para aprender:

- Express.js
- CRUD
- Rotas REST
- JSON
- APIs
- Backend básico
- Integração com Frontend