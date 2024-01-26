import local from 'passport-local'
import jwt from 'passport-jwt'
import passport from 'passport'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { userModel } from "../models/user.models.js";
import 'dotenv/config'




const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token

const initializePassport = () => {


    const cookieExtractor = req => {
        
        const token = req.headers.authorization ? req.headers.authorization : {};

        console.log("cookieExtractor", token)
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { 
        try {
            console.log("JWT", jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

   
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age ,role } = req.body
            try {
                const user = await userModel.findOne({ email: email })
                if (user) {
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    age: age,
                    email: email,
                    password: passwordHash,
                    role: role || 'user'
                })
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }))

   
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                if (!user) {
                    return done(null, false)
                }
                if (validatePassword(password, user.password)) {
                    return done(null, user)
                }
                return done(null, false)
            } catch (error) {
                return done(error)
            }
        }))

    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport