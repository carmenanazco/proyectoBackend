const socket = io();

class Product {
    constructor(title,category,description, price, code, stock) {
        this.title = title
        this.category = category
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
    }
} 

let form = document.querySelector("form")
let listProducts = document.querySelector("#lista")

form.addEventListener("submit",(e) => {
    e.preventDefault()

    const {title,category,description, price, code, stock} = e.target.elements    
    let product = new Product(title.value,category.value,description.value, price.value, code.value, stock.value)
    socket.emit('newProduct', product);


    title.value= '';
    description.value= '';
    code.value= '';
    price.value= '';
    stock.value= '';
    category.value= '';   

})



socket.on('loadProduct', (products) =>{
    lista.innerHTML = ''; 
    products.forEach( (product) => {
    cargarProducto(product);
    })
})

socket.on('nuevoProducto', (product) =>{
    lista.innerHTML = ''; 
    cargarProducto(product);
})

function cargarProducto(product){
    let clon = document.querySelector('template').content.cloneNode(true)
    clon.querySelector('h2').innerText = product.title
    clon.querySelectorAll('p')[0].innerText += product.category
    clon.querySelectorAll('p')[1].innerText += product.description
    clon.querySelectorAll('p')[2].innerText += product.price


    clon.querySelector('button').addEventListener('click', () => {
        socket.emit('deleteProduct', product.id);
    } )
    lista.appendChild(clon)
}

