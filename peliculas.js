const express = require("express");
const router = express.Router();


router.post("/visualizado", function(req, res) {
    let db = req.app.locals.db

    let titulo = req.body.titulo
    
    db.collection("visualizados").insertOne({titulo:titulo},function(err,datos) {
        if (err !== null) {
            res.send({ mensaje: "Error al registrar el usuario" })
        } else {
            res.send({ registro: "si", mensaje: "Pelicula vista" })

        }
    })
   


    
})




module.exports = router;