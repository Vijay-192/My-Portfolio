import mongoose from "mongoose";

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("MongoDB Connection Success");
  } catch (error) {
    console.log("MongoDatabase Connection failed:", error);
  }
};

export default ConnectDatabase;
