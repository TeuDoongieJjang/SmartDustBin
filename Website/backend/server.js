import express from "express";
import dotenv from "dotenv";
import directRoute from "./apiRoute.js";
import connectDB from "./db.js";
import path from "path";

dotenv.config();

const port = process.env.PORT || 2700;

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use("/api", directRoute);

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Listening to PORT: ${port}`);
  } catch (error) {
    console.log(`Error in Listening: ${error}`);
  }
});
