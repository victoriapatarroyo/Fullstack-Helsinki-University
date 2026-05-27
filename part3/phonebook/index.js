//Consulta directorio telefónico
const express = require("express");
const app = express();

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

//Endopint lista todos los contactos
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//Endpoint que consulta número de registros en la agenda y hora de consulta
app.get("/info", (request, response) => {
  const total = persons.length;
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `);
});

//Endopint listar información de un solo contacto
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(400).end();
  }
});

//Endopint para eliminar un contacto
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
