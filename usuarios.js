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

    db.collection("usuarios").find({ mail: mail }).toArray(function(err, datos) {
        if (err !== null) {
            res.send({mensaje: "Error: " + err})
        } else {
            if (datos.length > 0) {
                res.send({registro: "no", mensaje: "Ese mail ya ha sido utilizado"})
            } else {
              
                db.collection("usuarios").insertOne({ usuario: nombre, apellido1: apellido1, apellido2: apellido2, anyo: anyo, mes: mes, dia: dia, mail: mail, password: password, rango: "usuario", cesta: [], favoritos: [], compras: [] }, function(err, datos) {
                    if (err !== null) {
                        console.log(err)
                        res.send({registro: "no", mensaje: "Error al registrar el usuario" })
                    } else {
                        res.send({registro: "si", mensaje: "Usuario registrado correctamente", usuario: mail})
                    }
                });
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
                   /*  console.log(arrayUsuario) */
                    res.send({ entrar: "si", mensaje: "Logueado correctamente", usuario: mail, dia: arrayUsuario[0].dia, mes:arrayUsuario[0].mes,anyo:arrayUsuario[0].anyo,apellido1:arrayUsuario[0].apellido1,apellido2:arrayUsuario[0].apellido2 });
                } else {
                    res.send({ entrar: "no", mensaje: "Contraseña incorrecta" });
                }
            } else {
                res.send({ entrar: "no", mensaje: "El usuario no existe" });
            }
        }
    });
});

router.post("/adminchange", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.mail;
    let estado = req.body.rango;
    console.log(mail,estado)

    db.collection("usuarios").find({ mail: mail }).toArray(function(err, arrayUsuario) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {

            if (estado == "admin" || estado == "usuario") {
                db.collection("usuarios").updateOne({ mail:mail},{ $set: {rango:estado}}, function(err, datos) {
                    if (err !== null) {
                        console.log(err)
                        res.send({ mensaje: "Error al registrar el usuario" })
                    } else {
        
                    res.send({mensaje: "Usuario editado correctamente", usuario: mail})
        
                    }
                })
            } else {
                console.log("ey")
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

router.post("/editar", function(req, res) {
    let db = req.app.locals.db

    let nombre = req.body.nombre;
    let apellido1 = req.body.apellido1;
    let apellido2 = req.body.apellido2;
    let fecha = req.body.fecha;
    /* let anyo = parseInt(fecha.substring(0,4));
    let mes = parseInt(fecha.substring(5,7));
    let dia = parseInt(fecha.substring(8,10)); */
    let mail = req.body.mail;
    let password = req.body.password;

    console.log(nombre,mail)

    db.collection("usuarios").find({ mail: mail}).toArray(function(err,datos) {
        if (err !== null) {
            res.send({mensaje: "Error: " + err})
        } else {
           /*  console.log(datos, datos.length) */
            if (datos.length == 0) {
                res.send({registro: "no", mensaje: "Ese mail ya ha sido utilizado"})
            } else {
               /*  console.log(nombre) */
                db.collection("usuarios").updateOne({ mail:mail},{ $set: {usuario: nombre/* , apellido1: apellido1, apellido2: apellido2 *//* , anyo: anyo, mes: mes, dia: dia */}}), function(err, datos) {
                    if (err !== null) {
                        console.log(err)
                        res.send({ mensaje: "Error al registrar el usuario" })
                    } else {
            
                       res.send({mensaje: "Usuario editado correctamente", usuario: mail})
            
                    }
                }
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
                
                db.collection("usuarios").updateOne({ mail: mail}, { $push: { cesta: { $each: [{ titulo: titulo, cesta:"cesta",cartel: cartel, id: id,precio:precio,producto:producto, cantidad:1}], $position: 0 } } }, function(err, datos) {
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

let cesta

router.post("/visualizarCesta", function(req, res) {
    let db = req.app.locals.db

    let usuario = req.body.usuario

   db.collection("usuarios").find({mail: usuario}).toArray(function(err, datos) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {
            let suma = 0

            cesta = datos[0].cesta
           
            for (let i = 0; i < cesta.length; i++) {
                suma = suma + cesta[i].precio
            }

            res.send({datos:datos,total:suma})
        }
    });
});

router.post("/compras", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.usuario
    let borrar

   db.collection("usuarios").find({mail: mail}).toArray(function(err, datos) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {
            cesta=datos[0].cesta
            db.collection("usuarios").updateOne({ mail: mail}, { $push: { compras: { $each: [{ compra: cesta}], $position: 0 } } }, function(err, datos) {
                if (err !== null) {
                    console.log(err)
                    res.send({ mensaje: "Error:" + err })
                } else {
                    
                    db.collection("usuarios").find({mail:mail}).toArray(function(err,datos){
                        if (err !== null){
                            console.log(err)
                            res.send({mensaje: "Error: "+ err})
                        } else {
                            let longitud = 0
                            borrar= datos[0].cesta
                            longitud = borrar.length

                            db.collection("usuarios").updateOne({ mail: mail }, { $set: { cesta: [] } }, function(err, datos) {
                                if (err !== null) {
                                    console.log(err)
                                    res.send({ mensaje: "Error:" + err })
                                } else {
                                    db.collection("usuarios").find({mail: mail}).toArray(function(err, datos) {
                                        if (err !== null) {
                                            res.send({ mensaje: "Ha habido un error" });
                                        } else {
                                            res.send(datos)
                                        }
                                    })
                                }
                            })
                        }
                    })

                    

                }
            })

        }
    });
});

router.post("/compras/eliminar", function(req, res) {
    let db = req.app.locals.db

    let mail = req.body.usuario
    let id = req.body.id
    let arrayCesta
    let indice = 0
    let longitud = 0
    let borrar

   db.collection("usuarios").find({mail: mail}).toArray(function(err, datos) {
        if (err !== null) {
            res.send({ mensaje: "Ha habido un error" });
        } else {
            arrayCesta = datos[0].cesta
            longitud = arrayCesta.length
           

           for (let i = 0; i < longitud; i++) {
               if (arrayCesta[i].id === id) {
                   indice = i
               }
           }
            
            arrayCesta.splice(indice,1)
            
            db.collection("usuarios").updateOne({ mail: mail }, { $set: { cesta: [] } }, function(err, datos) {
                if (err !== null) {
                    console.log(err)
                    res.send({ mensaje: "Error:" + err })
                } else {
                    
                    for (let i = 0; i < arrayCesta.length; i++) {
                        console.log("1")
                        db.collection("usuarios").updateOne({ mail: mail}, { $push: { cesta: { $each: [{ titulo: arrayCesta[i].titulo, cesta: arrayCesta[i].cesta,cartel: arrayCesta[i].cartel, id: arrayCesta[i].id,precio:arrayCesta[i].precio,producto:arrayCesta[i].producto, cantidad:arrayCesta[i].cantidad}], $position: 0 } } }, function(err, datos) {
                            if (err !== null) {
                                console.log(err)
                                res.send({ mensaje: "Error:" + err })
                            } else {
                                
                            }
                        })
                    }

                    db.collection("usuarios").find({mail: mail}).toArray(function(err, datos) {
                        if (err !== null) {
                            res.send({ mensaje: "Ha habido un error" });
                        } else {
                            let suma = 0

                            cesta = datos[0].cesta
           
                            for (let i = 0; i < cesta.length; i++) {
                            suma = suma + cesta[i].precio
                            }

                            res.send({datos:datos,total:suma})
                        }
                    })

                }
            })


        }
    });
   
});

module.exports = router;