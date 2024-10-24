import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "kudizen",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

// let isConnected = false; // this is a global variable that will be used to check if the user is connected to the database or not

// export const connectToDatabase = async () => {
//   mongoose.set("strictQuery", true);

//   if (isConnected) {
//     console.log("using existing database connection");
//     return;
//   }

//   // Connect to our database

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI as string, {
//       dbName: "kudizen",

//       //   useNewUrlParser: true,
//       //   useUnifiedTopology: true,
//     });

//     isConnected = true;
//     console.log("new database connection");
//   } catch (error) {
//     console.log("error connecting to database");
//     console.log(error);
//   }
// };
