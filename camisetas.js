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
    let edad = req.body.edad
    let producto = req.body.producto
    let visualizaciones
    let edadMedia

    db.collection("visualizados").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                edadMedia = 0
                edadMedia = parseInt(datos[0].edadMedia) + edad
                visualizaciones = 0
                visualizaciones = parseInt(datos[0].visualizado) + 1
                db.collection("visualizados").updateOne({id:id},{$set: {visualizado: visualizaciones, edadMedia: edadMedia}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar visualizados"})
                    } else {
                        res.send({mensaje: "Actualizado visualización"})
                    }
                })
            } else {
                db.collection("visualizados").insertOne({titulo:titulo,cartel:cartel,id:id, visualizado: 1, edadMedia: edad, producto: producto},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear visualización de camiseta"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado visualización de camiseta"})
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
    let edad = req.body.edad
    let producto = req.body.producto
    let elegidas
    
    db.collection("favoritas").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                edadMedia = 0
                edadMedia = parseInt(datos[0].edadMedia) + edad
                elegidas = 0
                elegidas = parseInt(datos[0].favoritas) + 1
                db.collection("favoritas").updateOne({id:id},{$set: {favoritas: elegidas, edadMedia: edadMedia}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar favoritas"})
                    } else {
                        res.send({mensaje: "Actualizado favoritos"})
                    }
                })
            } else {
                db.collection("favoritas").insertOne({titulo:titulo,cartel:cartel,id:id, edadMedia: edad, favoritas: 1, producto: producto},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear favoritos de camisetas"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado el favorito de camisetas"})
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
    let edad = req.body.edad
    let producto = req.body.producto
    let precio = req.body.precio
    
    let enCesta
   
    db.collection("cesta").find({id:id}).toArray(function(err,datos) {
        if (err !== null) {
            res.send("Error:" + err)
        } else {
            if (datos.length > 0) {
                edadMedia = 0
                edadMedia = parseInt(datos[0].edadMedia) + edad
                enCesta = 0
                enCesta = parseInt(datos[0].cesta) + 1
                db.collection("cesta").updateOne({id:id},{$set: {cesta: enCesta, edadMedia: edadMedia}},function(err,datos){
                    if (err !== null) {
                        res.send({mensaje:"Error al actualizar compradas"})
                    } else {
                        res.send({mensaje: "Actualizado compradas"})
                    }
                })
            } else {
                db.collection("cesta").insertOne({titulo:titulo,cartel:cartel, edadMedia: edad, id:id, precio:precio,cesta: 1, producto: producto},function(err,datos) {
                    if (err !== null) {
                        res.send({mensaje: "Error al crear compradas de camisetas"})
                    } else {
                        res.send({creado: "si", mensaje: "Creado la compra de camisetas"})
                        
                    }
                })
            }   
        }
    })     
})

module.exports = router;