import { useState, useEffect } from "react";
import Name from "./components/Name";
import Filter from "./components/Filter";
import personService from "./services/person";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    const nameExiste = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    // 🔁 UPDATE
    if (nameExiste) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (!confirmUpdate) return;

      personService
        .update(nameExiste.id, nameObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== nameExiste.id ? p : returnedPerson)),
          );
          setNewName("");
          setNewNumber("");

          setMessage(`${returnedPerson.name} updated`);
          setTypeMessage("successful");

          setTimeout(() => setMessage(null), 5000);
        })
        .catch((error) => {
          setMessage(
            error.response?.data?.error ||
              `Information of ${nameExiste.name} has already been removed from server`,
          );
          setTypeMessage("error");

          setTimeout(() => setMessage(null), 5000);

          setPersons(persons.filter((p) => p.id !== nameExiste.id));
        });

      return;
    }

    // CREATE
    personService
      .create(nameObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");

        setMessage(`${returnedPerson.name} added to phonebook`);
        setTypeMessage("successful");

        setTimeout(() => setMessage(null), 5000);
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || "Something went wrong";

        // Opcional: limpiar mensaje feo de mongoose
        if (errorMsg.includes("`name`")) {
          setMessage("Name must be at least 3 characters long");
        } else {
          setMessage(errorMsg);
        }

        setTypeMessage("error");

        setTimeout(() => setMessage(null), 5000);
      });
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const namesToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const deleteNameOf = (id) => {
    const person = persons.find((n) => n.id === id);

    if (!person) return;

    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (!confirmDelete) return;

    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((n) => n.id !== id));

        setMessage(`${person.name} has been removed`);
        setTypeMessage("successful");

        setTimeout(() => setMessage(null), 5000);
      })
      .catch(() => {
        setMessage(
          `Information of ${person.name} has already been removed from server`,
        );
        setTypeMessage("error");

        setTimeout(() => setMessage(null), 5000);

        setPersons(persons.filter((p) => p.id !== id));
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} typeMessage={typeMessage} />

      <Filter filter={filter} onChange={handleFilterChange} />

      <h2>Add a new</h2>
      <form onSubmit={addName}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Phone: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <button type="submit">Save</button>
      </form>

      <h2>Numbers</h2>
      <ul>
        {namesToShow.map((person) => (
          <Name
            key={person.id}
            name={person}
            deleteName={() => deleteNameOf(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
