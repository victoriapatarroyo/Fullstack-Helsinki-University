import { useState } from "react";
import Name from "./components/Name";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();
    const nameObjetc = {
      name: newName,
    };

    setPersons(persons.concat(nameObjetc));
    setNewName("");
  };

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <input value={newName} onChange={handleNameChange} />
        <button type="submit">Save</button>
      </form>
      <ul>
        {persons.map((name, index) => (
          <Name key={index} name={name} />
        ))}{" "}
      </ul>
      <h2>Numbers</h2>
      ...
    </div>
  );
};

export default App;
