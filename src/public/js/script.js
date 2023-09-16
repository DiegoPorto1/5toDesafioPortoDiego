const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let user

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese su nombre de usuario valido"
    },
    allowOutsideClick: false
}).then(resultado => {
    userEmail = resultado.value
    socket.emit("mostratChats")
    console.log(user)
})

botonChat.addEventListener('click', () => {
    

    if (valInput.value.trim().length > 0) {
        socket.emit('nuevoMensaje', { email: userEmail, message: valInput.value })
        valInput.value = "";
    }
})

socket.on('mensajes', (arrayMensajes) => {
    parrafosMensajes.innerHTML = "";

    
        arrayMensajes.forEach((element) => {
            parrafosMensajes.innerHTML += `
                <li class="liParrafosMensajes">
                 <div class="spanContainer">
                    <p>${element.postTime}</p>
                    <p>${element.email}:</p>
                 </div>
                <p class="userMessage">${element.message}
                </p>
                </li>
            `;
    });
});