const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Morgan token para mostrar body en POST
morgan.token("body", (req) => JSON.stringify(req.body));

// Morgan CORRECTO
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// 👇 Servir frontend (asegúrate que /dist esté en este mismo directorio)
app.use(express.static(path.join(__dirname, "dist")));

// Datos en memoria
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

// ====================
// ENDPOINTS API
// ====================

// Obtener todos
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Info
app.get("/info", (req, res) => {
  const total = persons.length;
  const date = new Date();

  res.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `);
});

// Obtener uno
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Eliminar
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

// Crear
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.some((p) => p.name === body.name);

  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.status(201).json(newPerson);
});

// ====================
// SPA FALLBACK (React)
// ====================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ====================
// SERVER
// ====================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
