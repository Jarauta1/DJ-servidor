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

router.post("/visualizado", function(req, res) {
    let db = req.app.locals.db

    let titulo = req.body.titulo
    let cartel = req.body.cartel
    let id = req.body.id
    let visualizaciones
 
    db.collection("visualizados").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                visualizaciones = 0
                visualizaciones = parseInt(datos[0].visualizado) + 1
                db.collection("visualizados").updateOne({id:id},{$set: {visualizado: visualizaciones}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar visualizados"})
                    } else {
                        res.send({mensaje: "Actualizado visualización"})
                    }
                })
            } else {
                db.collection("visualizados").insertOne({titulo:titulo,cartel:cartel,id:id, visualizado: 1},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear visualización de película"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado visualización de película"})
                    }
                })
            }   
        }
    })     
})

router.post("/favoritas", function(req, res) {
    let db = req.app.locals.db

    let titulo = req.body.titulo
    let cartel = req.body.cartel
    let id = req.body.id
    let elegidas
    
    db.collection("favoritas").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                elegidas = 0
                elegidas = parseInt(datos[0].favoritas) + 1
                db.collection("favoritas").updateOne({id:id},{$set: {favoritas: elegidas}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar favoritas"})
                    } else {
                        res.send({mensaje: "Actualizado favoritos"})
                    }
                })
            } else {
                db.collection("favoritas").insertOne({titulo:titulo,cartel:cartel,id:id, favoritas: 1},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear favoritos de película"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado el favorito de película"})
                    }
                })
            }   
        }
    })     
})

router.post("/cesta", function(req, res) {
    let db = req.app.locals.db

    let titulo = req.body.titulo
    let cartel = req.body.cartel
    let id = req.body.id
    let descargas = req.body.descargas
    let enCesta
    
    db.collection("cesta").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                enCesta = 0
                enCesta = parseInt(datos[0].cesta) + 1
                db.collection("cesta").updateOne({id:id},{$set: {cesta: enCesta}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar compradas"})
                    } else {
                        res.send({mensaje: "Actualizado compradas"})
                    }
                })
            } else {
                db.collection("cesta").insertOne({titulo:titulo,cartel:cartel,id:id, cesta: descargas},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear compradas de película"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado la compra de película"})
                    }
                })
            }   
        }
    })     
})

module.exports = router;