const fs = require('fs');
const moment = require('moment')
const { builtinModules } = require('module');
const mongoose = require('mongoose')
require('dotenv').config()

const { MONGODB_USER, MONGODB_PW } = process.env

mongoose.connect(
    `mongodb+srv://${MONGODB_USER}:${MONGODB_PW}@cluster0.cshkh7l.mongodb.net/?retryWrites=true&w=majority`,
    {
        userNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw new Error(` Error de conexión a la base de datos ${err} `)
        console.log(' Base de datos conectada ')
    }

)



//Clase Container
class Container {

    constructor(file) {
        this.file = file;
    }
    //Función para guardar un producto
    async save(object) {
        try {

            if (!fs.existsSync(this.file)) {
                fs.writeFileSync(this.file, "[]")
            }
            let products = await fs.promises.readFile(this.file, 'utf-8')
            if (!products) {
                object = { id: 1, timestamp: moment().format('DD/MM/YYYY, h:mm:ss'), ...object }
                products = [object]
                await fs.promises.writeFile(this.file, JSON.stringify(products))
                return 1
            }
            else {
                products = JSON.parse(products)
                const idObject = products[products.length - 1].id + 1
                object = { id: idObject, timestamp: moment().format('DD/MM/YYYY, h:mm:ss'), ...object }
                products = [...products, object]
                await fs.promises.writeFile(this.file, JSON.stringify(products))
                return idObject

            }

        } catch (error) {
            console.log('Error al guardar el producto en save():', error)
        }
    }

    //Función para traer el listado de productos
    async getAll() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8')
            const productsParsed = JSON.parse(products)
            return productsParsed
        } catch (error) {
            console.log('Error de lectura en getAll():', error)
        }
    }

    //Función para borrar el listado de productos
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file, "[]")

        } catch (error) {
            console.log('Error al borrar productos en deleteAll():', error)

        }
    }

    //Función para actualizar un producto según su id
    async updateById(id, newProduct) {
        let arrayProducts = await this.getAll()
        arrayProducts = arrayProducts.map(product => {
            if (product.id == id) return { id, timestamp: moment().format('DD/MM/YYYY, h:mm:ss'), ...newProduct }
            return product
        })
        await fs.promises.writeFile(this.file, JSON.stringify(arrayProducts))

    }

    //Función para traer un producto de acuerdo con el id 
    async getById(id) {
        try {
            let products = await this.getAll()
            let foundProduct = products.find(product => {
                return product.id == id
            })
            if (foundProduct) {
                return foundProduct

            }
            else {
                console.log("no se encontró el producto")
                return null
            }

        } catch (error) {
            console.log('Error al obtener producto en getById():', error)

        }
    }

    //Función para borrar un producto de acuerdo con el id 
    async deleteById(id) {
        let products = await this.getAll()
        let productToDelete = await this.getById(id)

        products = products.filter(product => {
            return product.id != productToDelete.id
        })

        await fs.promises.writeFile(this.file, JSON.stringify(products))


    }
}

module.exports = Container