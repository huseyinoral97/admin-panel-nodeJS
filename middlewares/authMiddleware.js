// authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Token bulunamadı. Yetkilendirme reddedildi." });
    }
    const tokenWithoutBearer = token.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı. Yetkilendirme reddedildi." });
        }

        req.user = user; // Kullanıcı bilgisini request nesnesine ekle
        next();
    } catch (error) {
        console.log(error); // Hatanın loglanması

        res.status(401).json({ message: "Geçersiz token. Yetkilendirme reddedildi." });
    }
};
