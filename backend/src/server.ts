import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db'
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from './routes/adminRoutes'
import redisclient from './config/redis'
import logger from './config/logger'
import cookieParser from 'cookie-parser'
import operatorRoutes from './routes/operatorRoutes'


dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use("/api/auth", authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/operator',operatorRoutes)

app.use(errorHandler);

const PORT = process.env.PORT

const startServer = async () => {
    try {
        await connectDB()

        await redisclient.connect();
        app.listen(PORT,()=>{
            logger.info(`Server Started at${PORT}`)
        })        
    } catch (error) {
        console.log('Server Failed : ',error)
    }
}
startServer()