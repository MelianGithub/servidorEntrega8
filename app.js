const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const jwt = require ('jsonwebtoken');
const SECRET_KEY = "clavesecreta"
app.use(bodyParser.json());



// BD
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: "localhost", user: "root", password: "1947", database:"entrega8", connectionLimit: 10});


app.post('/cart', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const cartItems = req.body.cosasenelcart; 

        
        for (const item of cartItems) {
            await connection.query('INSERT INTO carrito (id, name, unitCost, currency, image, count) VALUES (?, ?, ?, ?, ?, ?)', [item.id, item.name, item.unitCost, item.currency, item.image, item.count]);
        }

        connection.release();

        // Envia una respuesta de éxito al cliente
        res.status(200).json({ message: 'Carrito actualizado con éxito en la base de datos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el carrito en la base de datos' });
    }
});





app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));


let cats = require('./API/cats/cat.json');
let buy = require('./API/cart/buy.json');
let publish = require('./API/sell/publish.json');


let catsProducts = './API/cats_products';
let products = './API/products';
let productsComments = './API/products_comments';
let userCart = './API/user_cart';

let arrayUsers = [];


app.get("/", (req, res) => {
    res.send("Servidor Grupo 255 - 2023")
})

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto:", "3000")
})

app.get("/cats", (req, res) => {
    res.json(cats)
})

app.get("/buy", (req, res) => {
    res.json(buy)
})

app.get('/publish.json', (req, res) => {
    res.json(publish)
})

app.get("/cats_products/:id", (req, res) => {
    let productsId = req.params.id
    const rutaArchivos = `${catsProducts}/${productsId}`;

    const productData = require(rutaArchivos);
    res.json(productData);
})

app.get("/products/:id", (req, res) => {
    let productsId = req.params.id
    const rutaArchivos = `${products}/${productsId}`;

    const productData = require(rutaArchivos);
    res.json(productData);
})

app.get("/products_comments/:id", (req, res) => {
    let productsId = req.params.id
    const rutaArchivos = `${productsComments}/${productsId}`;

    const productData = require(rutaArchivos);
    res.json(productData);
})

app.get("/user_cart/:id", (req, res) => {
    let productsId = req.params.id
    const rutaArchivos = `${userCart}/${productsId}`;

    const productData = require(rutaArchivos);
    res.json(productData);

})

app.get("/login", (req, res) =>{
    res.json(arrayUsers)
})

app.post("/login", (req, res) => {
   
    const {username, password} = req.body;
    if(username === "admin" && password === "admin"){
        const token = jwt.sign({username}, SECRET_KEY )
        res.status(200).json({token})
    }else{
        res.status(401).json({menssege:"Usuario y/o contrase;a incorrecto"})
    }
});


// app.use('/cart', (req, res, next) =>{
//     try {
//         const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
//         console.log(decoded)
//         next();
//     } catch (error) {
//         res.status(401).json({menssege:"no autorizado"})
//     }
// })