'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const subMegaMenuData = [
                {
                    id: 1,
                    title: 'Assessment Services',
                    path: '/services/business-assurance/assessment',
                    megaMenuId: 1,
                    items: JSON.stringify([
                        "Quality Assessment",
                        "Risk Assessment",
                        "Compliance Assessment"
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'Certification Services',
                    path: '/services/business-assurance/certification',
                    megaMenuId: 1,
                    items: JSON.stringify([
                        "ISO Certification",
                        "Industry Certification",
                        "Custom Certification"
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: 'Automotive Solutions',
                    path: '/services/connectivity-products/automotive',
                    megaMenuId: 2,
                    items: JSON.stringify([
                        "Connected Cars",
                        "Vehicle Testing",
                        "Safety Systems"
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    title: 'IoT Solutions',
                    path: '/services/connectivity-products/iot',
                    megaMenuId: 2,
                    items: JSON.stringify([
                        "Smart Devices",
                        "Industrial IoT",
                        "IoT Security"
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            await queryInterface.bulkInsert('subMegaMenus', subMegaMenuData, {});
            console.log('SubMegaMenu seed data inserted successfully');

            return subMegaMenuData;
        } catch (error) {
            console.error('Error seeding subMegaMenus:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkDelete('subMegaMenus', null, {});
            console.log('SubMegaMenu seed data deleted successfully');
        } catch (error) {
            console.error('Error deleting subMegaMenu seeds:', error);
            throw error;
        }
    }
}; 