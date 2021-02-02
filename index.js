const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const bcrypt = require("bcrypt");
const cifrarContrasenia = require("./cifrarContrasenia")
const cors = require("cors")


let peliculas = require("./peliculas")
let usuarios = require("./usuarios")
let productos = require("./productos.js")
let comics = require("./comics")
let camisetas = require("./camisetas")
let zapatillas = require("./zapatillas")
let libros = require("./libros")
let graficas = require("./graficas")

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

let db;

MongoClient.connect("mongodb+srv://djarauta:dj18dj18@cluster0.v04vd.mongodb.net/dj-commerce?retryWrites=true&w=majority", function(err, client) {
    if (err !== null) {
        console.log(err);
    } else {
        app.locals.db = client.db("DJ-commerce");
    }
});

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();  
});

app.use("/peliculas", peliculas)
app.use("/usuarios", usuarios)
app.use("/productos", productos)
app.use("/comics", comics)
app.use("/camisetas", camisetas)
app.use("/zapatillas", zapatillas)
app.use("/libros", libros)
app.use("/graficas", graficas)

app.listen(process.env.PORT || 3000);
/* app.listen(3000); */