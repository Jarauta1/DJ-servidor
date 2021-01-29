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



module.exports = router;