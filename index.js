import express from "express";
import preprocessingRoutes from "./plagiarism/preprocessing.js";
import mongoose from "mongoose";

const app = express();

app.use("/preprocessing", preprocessingRoutes);
app.listen(8080);
