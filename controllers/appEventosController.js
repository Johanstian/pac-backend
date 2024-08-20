const cloudinary = require('../config/cloudinary');
const Eventos = require('../models/appEventos');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createEvents = async (req, res, next) => {
    try {
        const requiredFields = ['title', 'description', 'date', 'location'];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            return res.status(400).json({ error: `${missingField} es requerido` });
        }

        const eventosData = { ...req.body };

        if (req.file) {
            // Sube la imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            eventosData.imageUrl = uploadResult.secure_url; // Guarda la URL segura de la imagen
        }

        const newEvento = await Eventos.create(eventosData);
        res.status(200).json({
            success: true,
            data: newEvento
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getEvents = async (req, res, next) => {
    try {
        const eventos = await Eventos.find({})

        if (!eventos || eventos.length === 0) {
            res.status(404).json({ message: 'No se encontraron Eventos.' });
            return;
        }
        res.status(200).json(eventos);
    } catch (error) {
        return next(error);
    }
}

const getEventsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eventos = await Eventos.findById(id);

        if (!eventos) {
            res.status(404).json({ message: 'Eventos no encontrados.' });
            return;
        }
        res.status(200).json(eventos)
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'ID de Evento no válido.' });
        } else {
            return next(error);
        }
    }
}

module.exports = { createEvents, getEvents, getEventsById }