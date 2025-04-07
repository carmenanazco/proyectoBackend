import dotenv from "dotenv";
import program from "../utils/process.js";
import MongoSingleton from "../utils/MongoSingleton.js";

const { mode } = program.opts()
console.log(mode);

dotenv.config({    
    path: mode == 'production' ? './.env.production' : './.env.developer'
}); 

export const configObject = {
    port: process.env.PORT || 8080,
    privateKey: process.env.PRIVATE_KEY,
    URIMongoDB: process.env.URIMONGO,
    persistence: process.env.PERSISTENCE,
    user: process.env.Mail_USERNAME,
    pass: process.env.Mail_PASSWORD,
}


export const conectDB= async() =>{
    return MongoSingleton.getInstance(configObject.URIMongoDB)
    //await mongoose.connect(configObject.URIMongoDB)
    //let products = await productModel.paginate()
   /* .then(()=> console.log("Conexion a base de datos exitosa"))
    .catch((error)=> {
        console.error("Error en conexion: ", error)
        process.exit();
    })*/
}
