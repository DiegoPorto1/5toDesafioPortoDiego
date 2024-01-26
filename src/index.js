import  express  from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import 'dotenv/config';
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import sessionRouter from './routes/session.routes.js'
import { productModel } from './models/products.models.js'
import logger from './logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import passport from 'passport'
import initializePassport from './config/passport.js'





const app = express()
const PORT = 4000

const serverExpress = app.listen(PORT, () => {
    logger.info(`Server on port ${PORT}`)
})


mongoose.connect('mongodb+srv://DiegoPorto:yodiejo1@cluster0.5mqf58r.mongodb.net/?retryWrites=true&w=majority')
    .then(async() => {
        logger.info('BDD conectada')
       
       })
    .catch(() => logger.error('Error en conexion a BDD'))
  
    const swaggerOptions = {
      definition:{
        openapi: '3.1.0',
        info: {
          title: "Documentacion del ecommerce",
          description: "API Coder Backend"

        },
       
      },
      apis:[`${__dirname}/docs/**/*.yaml`]
    }

    const specs =  swaggerJSDoc (swaggerOptions)
    


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://DiegoPorto:yodiejo1@cluster0.5mqf58r.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology:true
        },
        ttl: 60
    }),
    secret: process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/session', sessionRouter)
//autenticación de que se ha logueado
const auth = (req, res, next) => {
    if (req.session.login === true) {
      return next();
    } else {
      return res.redirect("/api/sessions/login");
    }
  };





app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
app.use('/chat', express.static(path.join(__dirname, '/public')))
app.use('/realTimeProducts',express.static(path.join(__dirname, '/public')))
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.login === true; // Define una variable local en res.locals
    next();
  });





app.get('/realTimeProducts', auth, (req, res) => {
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

app.get('/static',auth, (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "Productos",
        js2: "home.js",
        

    })
});

    sessionRouter.get("/login", (req, res) => {
        res.render("login", {
          css: "style.css",
          title: "Login",
        });
      });
      


      app.get("/singup", (req, res) => {
        res.render("singup", {
          css: "style.css",
          title: "Sing Up",
          
        });
      });
      app.get('/loggerTest', (req, res) => {
        logger.debug('Este es un mensaje de debug desde /loggerTest.');
        logger.info('Este es un mensaje de información desde /loggerTest.');
        logger.warn('Este es un mensaje de advertencia desde /loggerTest.');
        logger.error('Este es un mensaje fatal desde /loggerTest.');
        res.send('Logs generados en /loggerTest.');
    });





const io = new Server(serverExpress)


io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado")
   
    socket.on('nuevoProducto',  async (nuevoProd) => {
        const {title, description, price, stock,category,code, thumbnails}= nuevoProd
        await productModel.create({title,description,price,stock,category,code,thumbnails})
    })
    socket.on('mostrarProductos', async () => {
        const products = await  productModel.find()
         socket.emit('productos', products);
      });

})





