const express = require('express');
const { Router } = express;
const router = Router();



// * Ruta del listado de productos
router.all('*', async (solicitud, respuesta) => {
    respuesta.status(401).send( { error : -1, descripcion: `ruta ${solicitud.path} método ${solicitud.method} no autorizada` })
})


module.exports = router;