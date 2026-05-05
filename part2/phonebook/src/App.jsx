import { useState, useEffect } from "react";
import axios from "axios";
import Name from "./components/Name";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

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

  useEffect(hook, []);

  const addName = (event) => {
    event.preventDefault();

    //Valido si existe el elemento
    const nameExiste = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameExiste) {
      alert(`${newName} is already to added to phonebook`);
      return;
    }

    const nameObjetc = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(nameObjetc));
    setNewName("");
    setNewNumber("");
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

  return (
    <div>
      <h2>Phonebook</h2>
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
          <Name key={person.name} name={person} />
        ))}{" "}
      </ul>
    </div>
  );
};

export default App;
