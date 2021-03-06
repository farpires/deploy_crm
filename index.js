//TENEMOS PRACTICAMENTE LO MISMO SOLO QUE NO VA A TENER VISTAS
//LA IDEA ES QUE SEA CONSUMIDA DESDE OTRO CONSUMIDOR SERVIDOR O DESDE UN TELEFONO MOBIL
const express = require('express');
const routes = require('./routes');
const mongooose = require('mongoose');
const bodyParser= require('body-parser');
require('dotenv').config({path:'variables.env'});

//cors te permite que te conectes a otro servidor para el intercambio de recursos

const cors = require('cors');

// conectar mongo
mongooose.Promise = global.Promise;
mongooose.connect(process.env.DB_URL,{
    useUnifiedTopology: true,//nuevo analizador de cadena url
    useNewUrlParser: true,//nuevo detección y supervisión del servidor 
    useCreateIndex: true,
});



//crear el servidor
const app = express();

//carpeta publicas 
app.use(express.static('uploads'));

//habilitado bodyparse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Definir un dominio para recibir las peticiones 
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin:(origin,callback)=>{
        // console.log(origin)
        //Revisar si la peticion viene de un servidor que esta en la lista blanca(whitelist)
        const existe = whitelist.some( dominio => dominio === origin);
        if(existe){
            callback(null,true);
        }else{
            callback(new Error('No permitido por CORS'));
        }
    }
}
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '');//NOTA: cuando publiques la aplicacion o la pagina web a donde esta () colocamos la URL permitida o los origen permitidos
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Habilitar Cors.   //politica para traspasar datos 
app.use(cors(corsOptions));



//ruta de la App
app.use('/', routes());



//host
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

//iniciar app
app.listen(port,host,()=>{
    console.log('el servidor esta funcionando')
})