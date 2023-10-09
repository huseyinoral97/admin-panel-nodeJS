// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const signUp = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        // Tokenları oluştur ve kullanıcıya döndür
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Tokenları kullanıcı modeline ekle
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ userId: user._id, accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Hatalı şifre." });
        }

        // Tokenları oluştur ve kullanıcıya döndür
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Tokenları kullanıcı modeline ekle
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ userId: user._id, accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// controllers/authController.js
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı." });
        }

        // Kullanıcının kullandığı refresh token'ı ile gelen refresh token eşleşiyor mu kontrol et
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Geçersiz refresh token." });
        }

        // Yeni bir erişim token'ı oluştur
        const newAccessToken = generateAccessToken(user._id);

        // Yeni bir refresh token oluştur
        const newRefreshToken = generateRefreshToken(user._id);

        // Eski refresh token'ı güncelle
        user.accessToken = newAccessToken;
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ message: "Geçersiz refresh token." });
    }
};
