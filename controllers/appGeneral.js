const Comment = require('../models/appCommentModel');
const Products = require('../models/appProductsModel');

const validateFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return field;
        }
    }
    return null;
};

const createComment = async (req, res, next) => {
    try {
        const requiredFields = [
            'name', 'lastname', 'comment'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            res.status(400);
            return next(new Error(`${missingField} es requerido`));
        }

        const dataComment = await Comment.create(req.body);
        res.status(200).json({
            success: true,
            dataComment
        })


    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getComments = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const comment = await Comment.find({});

        // Verificar si se encontraron tests
        if (!comment || comment.length === 0) {
            res.status(404).json({ message: 'No se encontraron comentarios.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }

        // Enviar los tests encontrados como respuesta
        res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {
        const requiredFields = [
            'title', 'subtitle', 'phone', 'address', 'products'
        ];
        const missingField = validateFields(req.body, requiredFields);
        if (missingField) {
            return res.status(400).json({ error: `${missingField} es requerido` });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const productData = { ...req.body, imageUrl };

        // const dataComment = await Products.create(req.body);
        const newProduct = await Products.create(productData);
        res.status(200).json({
            success: true,
            // dataComment
            data: newProduct
        });
        
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        // Obtener todos los tests
        const products = await Products.find({});

        // Verificar si se encontraron tests
        if (!products || products.length === 0) {
            res.status(404).json({ message: 'No se encontraron productos.' });
            return; // Termina la ejecución de la función después de enviar la respuesta
        }

        // Enviar los tests encontrados como respuesta
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado.' });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'ID de producto no válido.' });
        } else {
            return next(error);
        }
    }
};


module.exports = { createComment, getComments, createProduct, getProducts, getProductById }