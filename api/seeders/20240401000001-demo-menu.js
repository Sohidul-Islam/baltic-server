'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // First, check if table exists
            const [tables] = await queryInterface.sequelize.query(
                "SHOW TABLES LIKE 'menus'"
            );
            console.log('Tables found:', tables);

            const menuData = [
                {
                    id: 1,
                    title: 'Our Services',
                    path: '/services',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'About Us',
                    path: '/about',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: 'Contact',
                    path: '/contact',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // Insert menu data
            await queryInterface.bulkInsert('menus', menuData, {});
            console.log('Menu seed data inserted successfully');

            return menuData;
        } catch (error) {
            console.error('Error seeding menus:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkDelete('menus', null, {});
            console.log('Menu seed data deleted successfully');
        } catch (error) {
            console.error('Error deleting menu seeds:', error);
            throw error;
        }
    }
}; 