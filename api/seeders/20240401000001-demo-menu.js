'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Insert menu data
            await queryInterface.bulkInsert('menus', [
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
            ]);
            console.log('Menu seed data inserted successfully');
        } catch (error) {
            console.error('Error seeding menus:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('menus', null, {});
    }
}; 