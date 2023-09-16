
const socket = io.connect('http://localhost:4000');
console.log('conectado');
const botonProds = document.getElementById('btnProductos')



botonProds.addEventListener('click', () => {
    console.log("se emite?")
    socket.emit('mostrarProductos') 
})

socket.on('productos', (products)=>{
    const tableBody = document.querySelector("#productsTable tbody")
    let tabletContent=''
    if (products && Array.isArray(products)){
        products.forEach( product => {
            tabletContent +=
            `
            <tr>
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.code}</td>
            <td>${product.thumbnails}</td>
        </tr>`
        })
    } else {
        console.error ('Productos no encontrados o no es un array:', products)
    }

    tableBody.innerHTML = tabletContent;
});
