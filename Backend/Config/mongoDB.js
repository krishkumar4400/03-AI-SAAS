import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("mongodb connected successfully"); 
        });
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "postedBlog"
        });
    } catch (error) {
        console.log(error.message);
    }
}

export default connectMongoDB;