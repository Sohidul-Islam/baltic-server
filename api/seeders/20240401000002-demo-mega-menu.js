'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const megaMenuData = [
                {
                    id: 1,
                    title: 'Business Assurance',
                    path: '/services/business-assurance',
                    menuId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'Connectivity & Products',
                    path: '/services/connectivity-products',
                    menuId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: 'Industry Solutions',
                    path: '/services/industry-solutions',
                    menuId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    title: 'Company Information',
                    path: '/about/company',
                    menuId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            await queryInterface.bulkInsert('megaMenus', megaMenuData, {});
            console.log('MegaMenu seed data inserted successfully');

            return megaMenuData;
        } catch (error) {
            console.error('Error seeding megaMenus:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkDelete('megaMenus', null, {});
            console.log('MegaMenu seed data deleted successfully');
        } catch (error) {
            console.error('Error deleting megaMenu seeds:', error);
            throw error;
        }
    }
}; 