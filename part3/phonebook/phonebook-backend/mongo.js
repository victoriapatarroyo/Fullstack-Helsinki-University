const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const nameArg = process.argv[3];
const numberArg = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@primercluster.awfcttt.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

// ✅ Definición del esquema y modelo
const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Number = mongoose.model("Number", numberSchema);

// ✅ Conexión + guardado asegurando flujo correcto
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");

    // 📋 Caso 1: solo password → listar
    if (process.argv.length === 3) {
      return Number.find({}).then((result) => {
        console.log("Phonebook:");

        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      });
    }

    // ➕ Caso 2: guardar nuevo registro
    const name = process.argv[3];
    const numberArg = process.argv[4];

    const number = new Number({
      name: name,
      number: numberArg,
    });

    return number.save().then(() => {
      console.log(`Added ${name} number ${numberArg} to phonebook`);
    });
  })
  .then(() => {
    return mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
