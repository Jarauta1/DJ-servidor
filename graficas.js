const express = require("express");
const router = express.Router();
const app = express();
const bcrypt = require("bcrypt");
const cifrarContrasenia = require("./cifrarContrasenia")

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();  
});

router.post("/", function(req, res) {
    let db = req.app.locals.db

    let longitud
    let arrayCesta
    let arrayVistas
    let arrayFavoritos
    let arrayCompras

   db.collection("cesta").find().toArray(function(err, datos) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {
            res.send(datos)
        }
    });
});



module.exports = router;