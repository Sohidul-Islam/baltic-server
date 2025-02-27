'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const contentData = [
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
                                heading: "Why Choose Our Business Assurance?",
                                content: "Our business assurance services help organizations establish trust and maintain quality across their operations. With years of experience and a dedicated team of experts, we provide comprehensive solutions that ensure your business meets all necessary standards and regulations.",
                                image: "/images/why-choose-us.jpg",
                                position: "right"
                            }
                        },
                        {
                            type: "imageGrid",
                            data: {
                                images: [
                                    {
                                        src: "/images/certification.jpg",
                                        title: "Certification Services",
                                        description: "Industry-standard certifications"
                                    },
                                    {
                                        src: "/images/auditing.jpg",
                                        title: "Auditing Services",
                                        description: "Comprehensive audit solutions"
                                    }
                                ],
                                caption: "Our core services"
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
                                        title: "Automotive Solutions",
                                        description: "Connected car and mobility solutions"
                                    },
                                    {
                                        title: "IoT Integration",
                                        description: "End-to-end IoT connectivity services"
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