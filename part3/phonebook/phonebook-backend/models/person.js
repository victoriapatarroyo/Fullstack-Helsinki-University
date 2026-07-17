const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (value) {
        // Expresión regular:
        // 2 o 3 números + "-" + solo números
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: props =>
        `${props.value} no es un número válido. Formato esperado: XX-XXXXXXX o XXX-XXXXXXX`,  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
