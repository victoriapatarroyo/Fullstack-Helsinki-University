require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const Person = require("./models/person");

// =======================
// CONFIG
// =======================
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Parámetros opcionales (seed)
const shouldSeed = process.argv[2] === "seed";

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// =======================
// DATOS JSON (SEED)
// =======================
const persons = [
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

// =======================
// CONEXIÓN + SERVER
// =======================
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // 🌱 SEED opcional
    if (shouldSeed) {
      const count = await Person.countDocuments();

      if (count === 0) {
        const result = await Person.insertMany(persons);
        console.log("🌱 Datos insertados:", result.length);
      } else {
        console.log("⚠️ La base ya tiene datos, no se insertó seed");
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar:", err.message);
  }
};

// ====================
// ENDPOINTS API
// ====================

// Obtener todos
app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});
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
  const id = Person(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Eliminar
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(204).end;
  } catch (error) {
    next(error);
  }
});

// Crear
app.post("/api/persons", async (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  const savedPerson = await person.save();

  res.status(201).json(savedPerson);
});

// =======================
// FALLBACK FRONTEND
// =======================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// =======================
// START
// =======================
start();
