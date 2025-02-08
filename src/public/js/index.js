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
        console.log("me ejecute load")
    products.forEach( (product) => {
        cargarProducto(product);
    })
})

socket.on('nuevoProducto', (product) =>{
    console.log("me ejecute")

    cargarProducto(product);
})

function cargarProducto(product){
    let divConten = document.createElement("div")
    let h2Title = document.createElement("h2")
    let divCard = document.createElement("div")
    let pCat = document.createElement("p")
    let pDescr = document.createElement("p")
    let p = document.createElement("p")
    let button = document.createElement('button')

    divConten.classList.value = 'contenedor'
    divCard.classList.value = 'card'

    h2Title.innerText = `${product.title}`
    pCat.innerText = `Categoria ${product.category}`
    pDescr.innerText = `Description ${product.description}`
    p.innerText = `Precio ${product.price}`

    button.innerText = 'Eliminar'

    divCard.append(h2Title,pCat,pDescr,p,button)
    divConten.append(divCard)
    listProducts.append(divConten)
}
