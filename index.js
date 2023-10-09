import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";

dotenv.config(); // dotenv modülünü yükleyin ve konfigüre edin

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB bağlantısı başarılı.");
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
    }
};

connectDB(); // MongoDB'ye bağlan

// Routes
app.use("/api/auth", authRoute);

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
