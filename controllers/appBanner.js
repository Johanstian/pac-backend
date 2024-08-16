const cloudinary = require('../config/cloudinary');
const Banners = require('../models/appBanner');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createBanner = async (req, res, next) => {
    try {
        const requiredFields = ['title'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            return res.status(400).json({ error: `${missingField} es requerido` });
        }

        const bannerData = { ...req.body };

        if (req.file) {
            // Sube la imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            bannerData.imageUrl = uploadResult.secure_url; // Guarda la URL segura de la imagen
        }

        const newBanner = await Banners.create(bannerData);
        res.status(200).json({
            success: true,
            data: newBanner
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getBanners = async (req, res, next) => {
    try {
        const banners = await Banners.find({})
        
        if(!banners || banners.length === 0) {
            res.status(404).json({ message: 'No se encontraron Banners.' });
            return;
        }
        res.status(200).json(banners);
    } catch (error) {
        return next(error);
    }
}

module.exports = { createBanner, getBanners }