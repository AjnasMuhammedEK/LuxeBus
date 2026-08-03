import mongoose from 'mongoose'
import logger from './logger'

const connectDB = async () : Promise<void> => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI as string)
        logger.info("MongoDB Connected");
    } catch (error) {
        logger.error('DB connection Failed = ',error)
        
    }
}

export default connectDB