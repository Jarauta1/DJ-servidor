const express = require("express");
const router = express.Router();
const app = express();

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();  
});

router.post("/zapatillas", function(req, res) {
    let db = req.app.locals.db

 
    db.collection("producto").find().toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            res.send(datos)
        }
    })     
})



router.post("/zapatillas/id", function(req, res) {
    let db = req.app.locals.db

    let id = req.body.id
    let nombre = ""
    let descripcion = ""
    let precio = 0
    let imagen = ""
    let arrayZapatillas = {}

    db.collection("producto").find().toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            arrayZapatillas = datos[0].zapatillas
            for (let i = 0; i < arrayZapatillas.length; i++) {
                if (arrayZapatillas[i].id == id) {
                    nombre = arrayZapatillas[i].titulo
                    descripcion = arrayZapatillas[i].descripcion
                    precio = arrayZapatillas[i].precio
                    imagen = arrayZapatillas[i].imagen
                }
            }
            res.send({nombre: nombre, descripcion: descripcion, precio: precio,imagen:imagen,id:id})
        }
    })     
})

router.post("/camisetas", function(req, res) {
    let db = req.app.locals.db

 
    db.collection("producto").find().toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            res.send(datos)
        }
    })     
})

router.post("/camisetas/id", function(req, res) {
    let db = req.app.locals.db

    let id = req.body.id
    let nombre = ""
    let descripcion = ""
    let precio = 0
    let imagen = ""
    let arrayZapatillas = {}

    db.collection("producto").find().toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            arrayZapatillas = datos[0].zapatillas
            for (let i = 0; i < arrayZapatillas.length; i++) {
                if (arrayZapatillas[i].id == id) {
                    nombre = arrayZapatillas[i].titulo
                    descripcion = arrayZapatillas[i].descripcion
                    precio = arrayZapatillas[i].precio
                    imagen = arrayZapatillas[i].imagen
                }
            }
            res.send({nombre: nombre, descripcion: descripcion, precio: precio,imagen:imagen,id:id})
        }
    })     
})



module.exports = router;