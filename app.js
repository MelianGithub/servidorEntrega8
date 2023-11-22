const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const jwt = require ('jsonwebtoken');
const SECRET_KEY = "clavesecreta"

//HAAY QUE VER SI LO HACEMOS CON ESE FS O COMO ESTA HECHO
const fs = require('fs')

app.use(cors());
app.use(bodyParser.json());

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


app.use('/cart', (req, res, next) =>{
    try {
        const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
        console.log(decoded)
        next();
    } catch (error) {
        res.status(401).json({menssege:"no autorizado"})
    }
})