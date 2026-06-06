const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  cantidadMinima: {
    type: Number,
    default: 10
  },
  precio: {
    type: Number,
    required: true
  },
  categoria: String,
  ubicacion: String,
  activo: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', productoSchema);
