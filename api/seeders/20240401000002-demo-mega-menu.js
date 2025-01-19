'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkInsert('megaMenus', [
                {
                    id: 1,
                    title: 'Business Assurance',
                    path: '/services/business-assurance',
                    menuId: 1,
                    items: "Assessment, Auditing and Certification, Assurance and Verification Services, Digital Trust Assurance",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'Connectivity & Products',
                    path: '/services/connectivity-products',
                    menuId: 1,
                    items: "Automotive, Connectivity, Cybersecurity",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: 'Industry Solutions',
                    path: '/services/industry-solutions',
                    menuId: 1,
                    items: "Manufacturing, Healthcare, Retail",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            console.log('MegaMenu seed data inserted successfully');
        } catch (error) {
            console.error('Error seeding megaMenus:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('megaMenus', null, {});
    }
}; 