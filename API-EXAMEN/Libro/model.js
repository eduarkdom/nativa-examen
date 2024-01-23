const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const libroSchema = new Schema({
    ISBN: { type: String, required: true },
    nombreLibro: { type: String, required: true },
    autor: { type: String, required: true },
    editorial: { type: String, required: true },
    portada: String,
    paginas: { type: Number, required: true }
});

module.exports = mongoose.model('Libro', libroSchema);
