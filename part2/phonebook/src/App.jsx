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
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState(null);

  const hook = () => {
    console.log("Efecto");
    axios
      .get("http://localhost:3001/persons")
      .then((response) => {
        console.log("promesa ok");
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("error al obtener datos", error);
      });
  };

  //useEffect(hook, []);
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

    //Valido si existe el elemento
    const nameExiste = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameExiste) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (!confirmUpdate) {
        return;
      }

      personService
        .update(nameExiste.id, nameObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== nameExiste.id ? p : returnedPerson)),
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setMessage(
            `Information of ${nameExiste.name} has already been removed from server`,
          );
          setTypeMessage("error");

          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== nameExiste.id));
        });

      return;
    }

    personService.create(nameObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });

    setMessage(`${newName} is already to added to phonebook`);
    setTypeMessage("sucessfull");
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    return;
  };

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const namesToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const deleteNameOf = (id) => {
    const person = persons.find((n) => n.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name} ?`);

    if (!confirmDelete) {
      return;
    }

    personService
      .deletePerson(id)
      .then(() => setPersons(persons.filter((n) => n.id !== id)))
      .catch((error) => {
        setMessage(
          `Information of ${person.name} has already been removed from server`,
        );
        setTypeMessage("error");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setPersons(persons.filter((p) => p.id !== id));
      });

    setMessage(`${person.name} has been removed`);
    setTypeMessage("sucessfull");
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
        ))}{" "}
      </ul>
    </div>
  );
};

export default App;
