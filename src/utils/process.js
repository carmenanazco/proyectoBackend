import { Command } from "commander";
const program = new Command()

program
    .option('-p <port>', 'puerto de funcionamiento de mi servidor', 8080)
    .option('-l, --letters [letters...]', 'resto')
    
    .option('--mode <mode>', 'modo de ejecución del entorno del server', 'production')
    .parse()

console.log('options: ', program.opts())
//console.log('Resto de los argumento: ', program.args)
export default program

// console.log('1- iniciando el proceso')
// process.on('exit', code => {
//     console.log('2- esperando o escuchando hasta que ocurra un exit', code)
// })
// process.on('uncaughtException', exception => {
//     console.log('Escuchando errores no controlados', exception)
// })
// Console
// console.log('3- fin del proceso')