const express = require ('express');
const productos = require ('./productos')
const carritos = require ('./carritos')
const login = require ('./login')

const admin = false

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/productos',admin?productos:login)
app.use('/api/carritos', admin?carritos:login)
app.use('/static',express.static(__dirname+'/public'))


//Conexión al servidor
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`)
})

//Ruta get Raíz
app.get('/', (solicitud, respuesta) => {
    respuesta.send('<h1> Bienvenidos al servidor </h1>');
});


//Ruta get Raíz
app.get('/', (solicitud, respuesta) => {
    respuesta.send('<h1> Bienvenidos al servidor </h1>');
});


// * Ruta del listado de productos
app.all('*', async (solicitud, respuesta) => {
    respuesta.status(404).send( { error : -2, descripcion: `ruta ${solicitud.path} método ${solicitud.method} no implementada` })
})