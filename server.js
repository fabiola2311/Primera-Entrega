const express = require ('express');
const getProductos = require ('./productos')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/productos', getProductos)
app.use('/static',express.static(__dirname+'/public'))


//Conexión al servidor
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`)
})

//Ruta get Raíz
app.get('/', (solicitud, respuesta) => {
    respuesta.send('<h1> Bienvenidos al servidor </h1>');
});