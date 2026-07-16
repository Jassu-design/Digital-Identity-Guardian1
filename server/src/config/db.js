import mongoose from 'mongoose'

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected')
}

export default connectDatabase