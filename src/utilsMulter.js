import multer from 'multer';
import __dirname from './utils.js';

//Antes de iniciar multer, debemos configurar dónde se almacenaran los archivos
const storage = multer.diskStorage({
    //destination hará referencia a la carpeta donde se va a guardar el archivo
    destination: function(req, file,cb){
        cb(null,__dirname+'/public/img') //Especificamos la carpeta en este punto
    },
    //filename hará referencia al nombre final que contendrá el archivo
    filename: function(req, file, cb){
        cb(null, file.originalname) //originalname indica que se conserve el nombre inicial
    },
    
    path: function(req, file, cb){
        cb(null,`/img/${file.originalname}`) 
    },

})

export const uploader = multer({storage});