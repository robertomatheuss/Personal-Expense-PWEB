const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.get('/view', CategoryController.renderCategoryView); 

router.get('/type/:type', CategoryController.getCategoriesByType);

router.get('/', CategoryController.getAllCategories);

router.post('/', CategoryController.createCategory);

router.put('/:id', CategoryController.updateCategory);

router.delete('/:id', CategoryController.deleteCategory);


module.exports = router;