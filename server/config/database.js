import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
}
export default dbConnect;