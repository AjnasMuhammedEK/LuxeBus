import mongoose from 'mongoose'

const connectDB = async () : Promise<void> => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log('DB COnnected')
    } catch (error) {
        console.log('DB connection Failed = ',error)
        
    }
}

export default connectDB