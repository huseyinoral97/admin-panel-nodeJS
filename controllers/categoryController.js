import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    try {

        const existingCategory = await Category.findOne({ name, user: userId });

        if (existingCategory) {
            // Aynı isimde kategori bulundu, hata döndür
            return res.status(400).json({ message: "Bu isimde bir kategori zaten var." });
        }

        const category = await Category.create({ name, description, user: userId });
        res.status(201).json({ category });
    } catch (error) {
        res.status(400).json({ message: "Kategori oluşturulamadı.", error: error.message });
    }

}

export const deleteCategory = async (req, res) => {
    const { _id } = req.body;
    try {
        await Category.findByIdAndDelete(_id);

        res.status(201).json({ message: "Kategori başarıyla kaldırıldı." })
    } catch (error) {
        res.status(400).json({ message: "Kategori silinemedi.", error: error.message });
    }
}

export const listCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Kategoriler listelenirken bir hata oluştu.", error: error.message })
    }
}