import { createClient } from "redis";
import dotenv from 'dotenv'

dotenv.config()

const redisclient = createClient ({
    username:process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket :{
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),   
    }
})

redisclient.on('connect',()=>{
    console.log('Redis Connected')
})

redisclient.on("error", (err) => {
  console.error("Redis Error:", err);
})

export default redisclient