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
import checkoutRouter from './routes/checkout.routes.js'
import cors from 'cors'





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
    
    const corsOptions = {
      origin: 'https://donulay.onrender.com',  // Reemplaza con la URL de tu aplicación frontend
      credentials: true,  // Habilita el intercambio de cookies y encabezados de autorización
    };

app.use(cors(corsOptions));    
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

app.use('/src/images', express.static('src/images'));
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/session', sessionRouter)
app.use('/api/carts/checkout', checkoutRouter);
//autenticación de que se ha logueado
const auth = (req, res, next) => {
    if (req.session.login === true) {
      return next();
    } else {
      return res.redirect("/api/sessions/login");
    }
  };

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.login === true; // Define una variable local en res.locals
    next();
  });

      app.get('/loggerTest', (req, res) => {
        logger.debug('Este es un mensaje de debug desde /loggerTest.');
        logger.info('Este es un mensaje de información desde /loggerTest.');
        logger.warn('Este es un mensaje de advertencia desde /loggerTest.');
        logger.error('Este es un mensaje fatal desde /loggerTest.');
        res.send('Logs generados en /loggerTest.');
    });










