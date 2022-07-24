const express = require('express');
const { Router } = express;
const Container = require('./container.js')
const router = Router();


//Declaro ruta para obtener el listado de todos los productos
const productos = new Container("productos.txt")


// * Ruta del listado de productos
router.get('/', async (solicitud, respuesta) => {
    const listadoDeProductos = await productos.getAll()
    respuesta.status(200).send(listadoDeProductos)
})

// * Ruta del listado de productos por id
router.get('/:id', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    respuesta.status(200).send(await productos.getById(id))
})

// * Ruta de creación de nuevo producto
router.post('/', async (solicitud, respuesta) => {
    let newProduct = solicitud.body
    const idNewProduct = await productos.save(newProduct)
    newProduct = await productos.getById(idNewProduct)
    respuesta.status(200).send(newProduct)
})

// * Ruta de modificación de nuevo producto
router.put('/:id', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    const updatedProduct = solicitud.body
    try {
        if (productos.getById(id) == null) {
            throw new Error
        }
        await productos.updateById(id, updatedProduct)
        respuesta.status(200).json({
            result: 'ok',
            id,
            nuevo: await productos.getById(id)
        })
    } catch (error) {
        respuesta.status(404).json({ error: 'producto no encontrado' })
    }

})

// * Ruta del listado de productos por id
router.delete('/:id', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    try {
        await productos.deleteById(id)
        respuesta.status(200).json({
            result: 'ok',
            id
        })
    }
    catch (error) {
        console.log(error)
        respuesta.status(404).json({ error: 'producto no encontrado' })
    }
})

module.exports = router;