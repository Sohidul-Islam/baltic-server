'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // First verify that required foreign keys exist
            const menu = await queryInterface.sequelize.query(
                `SELECT id FROM menus WHERE id = 1`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            const megaMenus = await queryInterface.sequelize.query(
                `SELECT id FROM megaMenus WHERE id IN (1, 2)`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            const subMegaMenus = await queryInterface.sequelize.query(
                `SELECT id FROM subMegaMenus WHERE id IN (1, 3)`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            // Verify all required references exist
            if (!menu.length || megaMenus.length !== 2 || subMegaMenus.length !== 2) {
                throw new Error('Required foreign key references are missing. Please ensure menu, megaMenu, and subMegaMenu data exists.');
            }

            const contentData = [
                {
                    id: 1,
                    title: 'Assessment Services Overview',
                    menuId: 1,
                    megaMenuId: 1,
                    subMegaMenuId: 1,
                    sections: JSON.stringify([
                        {
                            type: "hero",
                            data: {
                                heading: "Assessment Services",
                                subheading: "Comprehensive Assessment Solutions",
                                image: "/images/assessment.jpg"
                            }
                        },
                        {
                            type: "text",
                            data: {
                                heading: "Why Choose Our Assessment Services?",
                                content: "Our assessment services provide thorough evaluation of your business processes...",
                                image: "/images/why-assessment.jpg",
                                position: "right"
                            }
                        }
                    ]),
                    sequence: 1,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'Automotive Solutions Overview',
                    menuId: 1,
                    megaMenuId: 2,
                    subMegaMenuId: 3,
                    sections: JSON.stringify([
                        {
                            type: "hero",
                            data: {
                                heading: "Automotive Solutions",
                                subheading: "Next-Generation Vehicle Technology",
                                image: "/images/automotive.jpg"
                            }
                        },
                        {
                            type: "features",
                            data: {
                                items: [
                                    {
                                        title: "Connected Vehicle Systems",
                                        description: "Advanced connectivity solutions for modern vehicles"
                                    },
                                    {
                                        title: "Safety Testing",
                                        description: "Comprehensive vehicle safety assessment"
                                    }
                                ]
                            }
                        }
                    ]),
                    sequence: 2,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // Insert content data
            await queryInterface.bulkInsert('contents', contentData, {});
            console.log('Content seed data inserted successfully');

            return contentData;
        } catch (error) {
            console.error('Error seeding contents:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkDelete('contents', null, {});
            console.log('Content seed data deleted successfully');
        } catch (error) {
            console.error('Error deleting content seeds:', error);
            throw error;
        }
    }
}; 