import {connect} from "mongoose";

class MongoSingleton{
    static #instance
    constructor(uri){
        connect(uri)
    }

    static getInstance(uri){
        if(this.#instance){
            console.log('Base de datos ya conectada');
            return this.#instance
        }
        this.#instance= new MongoSingleton(uri)
        console.log('Base de datos conectada')
        return this.#instance
    }
}

export default MongoSingleton