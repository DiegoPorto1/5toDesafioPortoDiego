import  express  from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import sessionRouter from './routes/session.routes.js'
import { productModel } from './models/products.models.js'
import { messageModel } from './models/messages.models.js'

const app = express()
const PORT = 4000

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


mongoose.connect('mongodb+srv://DiegoPorto:yodiejo1@cluster0.5mqf58r.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
app.use('/chat', express.static(path.join(__dirname, '/public')))
app.use('/realTimeProducts',express.static(path.join(__dirname, '/public')))


app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)



app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "products",
        js: "realTimeProducts.js",
        js2: "script.js"

    })
})
app.get('/chat', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "script.js",
        

    })
})
app.get('/static', (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "Productos",
        js2: "home.js",
        

    })
})



const io = new Server(serverExpress)


io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado")
   


    socket.on('nuevoMensaje', async ({email, message}) => {
        console.log(message)
        await messageModel.create({email:email, message: message})
        const messages = await messageModel.find()
        socket.emit('mensajes', messages)
    })


    socket.on('nuevoProducto',  async (nuevoProd) => {
        const {title, description, price, stock,category,code, thumbnails}= nuevoProd
        await productModel.create({title,description,price,stock,category,code,thumbnails})
    })
    socket.on('mostrarProductos', async () => {
        const products = await  productModel.find()
         socket.emit('productos', products);
      });

      socket.on('mostrarChat', async()=>{
         const messages = await messageModel.find()
         socket.emit("mostrarMensajes", messages)
      })


})





