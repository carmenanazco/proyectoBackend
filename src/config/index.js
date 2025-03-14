import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();
const URIMongoDB = process.env.URIMONGO;

export const configObject = {
    port: process.env.PORT 
}


export const conectDB= async() =>{
    await mongoose.connect(URIMongoDB)
    //let products = await productModel.paginate()
    .then(()=> console.log("Conexion a base de datos exitosa"))
    .catch((error)=> {
        console.error("Error en conexion: ", error)
        process.exit();
    })
}
