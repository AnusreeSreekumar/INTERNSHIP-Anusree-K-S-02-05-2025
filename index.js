import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import studentRoute from './Routes/studentRoute.js';
import classRoute from './Routes/classRoute.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/", studentRoute);
app.use("/", classRoute);

app.listen(port, () => {        
    console.log(`Server is running on port ${port}`);
});  

const url = process.env.MONGO_URL;

mongoose.connect(url)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
