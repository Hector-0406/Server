//* Importaciones de Libreias y JSON
const express = require('express');  
const cors = require('cors');
const path = require('path');
let datos = require(path.join(__dirname, '../datosAPI.json'));
const mongoose = require('mongoose');
//* Colores Consola
const blue = '\x1b[34m';
const white = '\x1b[0m';
const yellow = '\x1b[33m';

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.conectarMongo();
        this.host = process.env.HOST;
        this.port = process.env.PORT;
    }

    middleware() {
        //! Inicializa el directorio público
        this.app.use(express.static('./public'));
        this.app.use(express.json());
        this.app.use(cors());
    }

    conectarMongo(){
        try{
            mongoose.connect('mongodb://localhost:27017/MinecraftDB');
            console.log('\n✅ MongoDB Conectado');
        }catch(error){
            console.error('❌ Error conectando a MongoDB:', error)
        }
        
        
        let Schema = mongoose.Schema;
        //Las claves y tipos coinciden con la BD
        const schemaArma = new Schema({
            nombre: String,
            tipo: String,
            danio: String,
            especial: String,
            encantamiento: String,
            durabilidad: String,
            descripcion: String
        });
        //Generamos el modelo
        this.armaModel = mongoose.model('arma', schemaArma);
    }

    routes() {
        // Ruta para consultar las armas de minecraft
        this.app.get('/consultarArma',  async(req, res) => {
            let  consulta = await this.armaModel.find({});
            res.json(consulta);
        });

        // Ruta para consultar datos del JSON
        this.app.get('/consultar', (req,res) => {
            res.json(datos); 
        });

        // Ruta para registrar un arma de minecraft
        this.app.post('/registrarArma', (req, res) => {
            //Datos recibidos del body o inputs
            let nombre = req.body.nombre;
            let tipo = req.body.tipo;
            let danio = req.body.danio;
            let especial = req.body.especial;
            let encantamiento = req.body.encantamiento;
            let durabilidad = req.body.durabilidad;
            let descripcion = req.body.descripcion;

            //Objeto con los datos del arma
            let arma = {
                nombre: nombre,
                tipo: tipo,
                danio: danio,
                especial: especial,
                encantamiento: encantamiento,
                durabilidad: durabilidad,
                descripcion: descripcion
            }

            //Guardar en MongoDB
            let guardar = new this.armaModel(arma);
            guardar.save(); 
            console.log('✅ Arma Registrada en MongoDB');
            res.send('Arma Registrada');
        });
    }

    //El puerto esta escuchando en el puerto 5000 
    listen() {
        //! Inicializa el servidor
        this.app.listen(this.port, () => {
            console.log('Local:',  blue + `http://${this.host}:${this.port}/`+ white);
            console.log('VPN:', blue + `http://100.113.115.21:${this.port}/`+  white);
            console.log(yellow + 'Use Ctrl+C to quit this process'+  white); }  
        );
    }

}
module.exports = Server; 
