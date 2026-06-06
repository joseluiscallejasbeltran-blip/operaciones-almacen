const express = require('express');
const Producto = require('../models/Producto');
const { autenticar, autorizarRol } = require('../middleware/autenticacion');
const router = express.Router();

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/', autenticar, autorizarRol(['admin', 'gerente']), async (req, res) => {
  try {
    const { codigo, nombre, cantidad, precio } = req.body;
    
    const productoExistente = await Producto.findOne({ codigo });
    if (productoExistente) {
      return res.status(400).json({ error: 'El código de producto ya existe' });
    }

    const producto = new Producto({ codigo, nombre, cantidad, precio });
    await producto.save();

    res.status(201).json({ message: 'Producto creado', producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/inventario/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/:id', autenticar, autorizarRol(['admin', 'gerente']), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Producto actualizado', producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/inventario/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/:id', autenticar, autorizarRol(['admin']), async (req, res) => {
  try {
    await Producto.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
