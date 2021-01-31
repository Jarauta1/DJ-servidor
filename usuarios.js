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

router.post("/registro", cifrarContrasenia, function(req, res) {
    let db = req.app.locals.db

    let nombre = req.body.nombre;
    let apellido1 = req.body.apellido1;
    let apellido2 = req.body.apellido2;
    let fecha = req.body.fecha;
    let anyo = parseInt(fecha.substring(0,4));
    let mes = parseInt(fecha.substring(5,7));
    let dia = parseInt(fecha.substring(8,10));
    let mail = req.body.mail;
    let password = req.body.password;

    db.collection("usuarios").find({ mail: mail}).toArray(function(err,datos) {
        if (err !== null) {
            res.send({mensaje: "Error: " + err})
        } else {
            if (datos.length > 0) {
                res.send({registro: "no", mensaje: "Ese mail ya ha sido utilizado"})
            } else {
                db.collection("usuarios").insertOne({ usuario: nombre, apellido1: apellido1, apellido2: apellido2, anyo: anyo, mes: mes, dia: dia, mail: mail, password: password, rango: "usuario", cesta: [], favoritos: [], compras: [] }), function(err, datos) {
                    if (err !== null) {
                        console.log(err)
                        res.send({ mensaje: "Error al registrar el usuario" })
                    } else {
            
                       res.send({mensaje: "Usuario registrado correctamente", usuario: mail})
            
                    }
                }
            }
        }
    })

    
})

router.post("/login", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.mail;
    let password = req.body.password;

    db.collection("usuarios").find({ mail: mail }).toArray(function(err, arrayUsuario) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {

            if (arrayUsuario.length > 0) {
                if (bcrypt.compareSync(password, arrayUsuario[0].password)) {
                    res.send({ entrar: "si", mensaje: "Logueado correctamente", usuario: mail });
                } else {
                    res.send({ entrar: "no", mensaje: "Contraseña incorrecta" });
                }
            } else {
                res.send({ entrar: "no", mensaje: "El usuario no existe" });
            }
        }
    });
});

router.post("/favoritos", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.usuario
    let titulo = req.body.titulo
    let cartel = req.body.cartel
    let precio = req.body.precio
    let producto = req.body.producto
    let id = req.body.id
   

    db.collection("usuarios").find({ mail: mail }).toArray(function(err, datos) {
        if (err !== null) {
            console.log(err)
            res.send({ mensaje: "Error:" + err })
        } else {
            if (datos.length > 0) {
                let favoritos = datos[0].favoritos
                let igual = false

                for (let i = 0; i < favoritos.length; i++) {
                    if (favoritos[i].titulo == titulo) {
                        igual = true
                    }
                }

                if (igual) {
                    res.send({mensaje: "Ya estaba en tus favoritos"})
                } else {
                    db.collection("usuarios").updateOne({ mail: mail }, { $push: { favoritos: { $each: [{ titulo: titulo, cartel: cartel, id: id,precio:precio, producto:producto,seccion: "favoritos"}], $position: 0 } } }, function(err, datos) {
                        if (err !== null) {
                            console.log(err)
                            res.send({ mensaje: "Error:" + err })
                        } else {
                            res.send({mensaje: "Película añadida a favoritos"})
                            
                        }
                    })
                }
                
            } else {
                res.send({mensaje: "Usuario no encontrado"})
            }
            
                }
                    
    })

})

router.post("/cesta", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.usuario
    let titulo = req.body.titulo
    let cartel = req.body.cartel
    let precio = req.body.precio
    let producto = req.body.producto
    let id = req.body.id
   

    db.collection("usuarios").find({ mail: mail }).toArray(function(err, datos) {
        if (err !== null) {
            console.log(err)
            res.send({ mensaje: "Error:" + err })
        } else {
            if (datos.length > 0) {
                
                db.collection("usuarios").updateOne({ mail: mail}, { $push: { cesta: { $each: [{ titulo: titulo, cartel: cartel, id: id,precio:precio,producto:producto, cantidad:1}], $position: 0 } } }, function(err, datos) {
                    if (err !== null) {
                        console.log(err)
                        res.send({ mensaje: "Error:" + err })
                    } else {
                        res.send({mensaje: "Película añadida a la cesta"})
                        
                    }
                })
            } else {
                res.send({mensaje: "Usuario no encontrado"})
            }
            
                }
                    
    })

})

router.post("/", function(req, res) {
    let db = req.app.locals.db

    let usuario = req.body.usuario

   db.collection("usuarios").find({mail: usuario}).toArray(function(err, datos) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {
            res.send({datos})
        }
    });
});

module.exports = router;