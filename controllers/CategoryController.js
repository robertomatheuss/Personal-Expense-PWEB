// controllers/CategoryController.js

const CategoryService = require('../services/CategoryService');

class CategoryController {

    async renderCategoryView(req, res) {
        try {
            const filterType = req.query.type; 
            let categories;

            if (filterType) {
                categories = await CategoryService.findByType(filterType);
            } else {
                categories = await CategoryService.findAll();
            }

            const types = CategoryService.validTypes;

            res.render('layout/main', { 
                title: 'Manage Categories', 
                categories: categories, 
                types: types,
                currentFilter: filterType || '',
                pageType: 'category',
            });
        } catch (error) {
            console.error('Error rendering category view:', error.message);
            res.status(500).send('Internal Server Error while loading view.');
        }
    }



    async createCategory(req, res) {
        try {
            const { name, type } = req.body;
            if (!name || !type) {
                return res.status(400).json({ 
                    error: true, 
                    message: "Validation Error: 'name' and 'type' are required." 
                });
            }

            const newCategory = await CategoryService.create({ name, type });
            
            return res.status(201).json({ 
                message: "Category created successfully.", 
                data: newCategory 
            });

        } catch (error) {
            console.error('Error creating category:', error.message);
            return res.status(400).json({ 
                error: true, 
                message: error.message || 'Error creating category.' 
            });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.findAll();
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
            return res.status(500).json({ 
                error: true, 
                message: 'Internal Server Error.' 
            });
        }
    }

    async getCategoriesByType(req, res) {
        try {
            const { type } = req.params;
            
            const categories = await CategoryService.findByType(type);
            
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Error filtering categories by type:', error.message);
            return res.status(400).json({ 
                error: true, 
                message: error.message || 'Invalid category type provided.' 
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedCategory = await CategoryService.update(id, updateData);

            if (!updatedCategory) {
                return res.status(404).json({ 
                    error: true, 
                    message: `Category with ID ${id} not found.` 
                });
            }
            
            return res.status(200).json({ 
                message: "Category updated successfully.", 
                data: updatedCategory 
            });

        } catch (error) {
            console.error('Error updating category:', error.message);
            return res.status(400).json({ 
                error: true, 
                message: error.message || 'Error updating category.' 
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            
            const deletedCount = await CategoryService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({ 
                    error: true, 
                    message: `Category with ID ${id} not found.` 
                });
            }
            
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting category:', error.message);
            return res.status(500).json({ 
                error: true, 
                message: 'Internal Server Error.' 
            });
        }
    }

}

module.exports = new CategoryController();