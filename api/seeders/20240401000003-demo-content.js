'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.bulkInsert('contents', [
                {
                    id: 1,
                    title: 'Business Assurance Overview',
                    menuId: 1,
                    megaMenuId: 1,
                    sections: JSON.stringify([
                        {
                            type: "hero",
                            data: {
                                heading: "Business Assurance Services",
                                subheading: "Ensuring Quality and Trust",
                                image: "/images/business-assurance.jpg"
                            }
                        },
                        {
                            type: "text",
                            data: {
                                content: "Our business assurance services help organizations..."
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
                    title: 'Connectivity Solutions',
                    menuId: 1,
                    megaMenuId: 2,
                    sections: JSON.stringify([
                        {
                            type: "hero",
                            data: {
                                heading: "Connectivity & Products",
                                subheading: "Next-Gen Solutions",
                                image: "/images/connectivity.jpg"
                            }
                        },
                        {
                            type: "features",
                            data: {
                                items: [
                                    {
                                        title: "Automotive",
                                        description: "Connected car solutions..."
                                    },
                                    {
                                        title: "IoT",
                                        description: "Internet of Things..."
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
            ]);
            console.log('Content seed data inserted successfully');
        } catch (error) {
            console.error('Error seeding contents:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('contents', null, {});
    }
}; 