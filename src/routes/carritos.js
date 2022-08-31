const express = require('express');
const { Router } = express;
const Container = require('../contenedores/ContenedorArchivo')
const router = Router();


//Declaro ruta para obtener el listado de todos los carritos
const carritos = new Container("src/utils/carritos.json")


// * Ruta del listado de carritos
router.get('/', async (solicitud, respuesta) => {
    const listadoDeCarritos = await carritos.getAll()
    respuesta.status(200).send(listadoDeCarritos)
})

// * Ruta del listado de productos de un carrito por id
router.get('/:id/productos', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    try {
        respuesta.status(200).send((await carritos.getById(id)).productos)
    } catch (error) {
        respuesta.status(401).send('No existe el carrito')

    }
})

// * Ruta de creación de nuevo producto en carrito existente
router.post('/:id/productos', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    const nuevoProducto = solicitud.body

    try {
        const carrito = await carritos.getById(id)
        carrito.productos.push(nuevoProducto)
        await carritos.updateById(id, carrito)

        respuesta.status(200).json({
            result: 'ok',
            id,
            nuevo: await carritos.getById(id)
        })

    } catch (error) {
        respuesta.status(404).json({ error: 'carrito no encontrado' })
    }
})

// * Ruta de creación de nuevo carrito
router.post('/', async (solicitud, respuesta) => {
    let nuevoCarrito = solicitud.body
    const idNuevoCarrito = await carritos.save(nuevoCarrito)
    nuevoCarrito = await carritos.getById(idNuevoCarrito)
    respuesta.status(200).send(nuevoCarrito)
})

// * Ruta del listado de carritos por id
router.delete('/:id', async (solicitud, respuesta) => {
    const { id } = solicitud.params
    try {
        await carritos.deleteById(id)
        respuesta.status(200).json({
            result: 'ok',
            id
        })
    }
    catch (error) {
        console.log(error)
        respuesta.status(404).json({ error: 'carrito no encontrado' })
    }
})

// * Ruta del listado de carritos por id
router.delete('/:id/productos/:id_prod', async (solicitud, respuesta) => {
    const { id, id_prod } = solicitud.params
    try {

        let carrito = await carritos.getById(id)

        carrito.productos = carrito.productos.filter(producto => {

            return producto.id != id_prod
        })


        await carritos.updateById(id, carrito)

        respuesta.status(200).json({
            result: 'ok',
            carrito: await carritos.getById(id)
        })
    }
    catch (error) {
        console.log(error)
        respuesta.status(404).json({ error: 'carrito no encontrado' })
    }
})

module.exports = router;