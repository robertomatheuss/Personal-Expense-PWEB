const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Rota para renderizar a tela (Visual)
router.get('/view', CategoryController.renderCategoryView);

// Rotas da API (JSON)
router.get('/', CategoryController.getAllCategories); // <--- O erro provável estava aqui
router.post('/', CategoryController.createCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;