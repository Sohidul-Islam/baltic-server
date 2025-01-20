'use strict';

const Menu = require('./Menu');
const MegaMenu = require('./MegaMenu');
const SubMegaMenu = require('./SubMegaMenu');
const Content = require('./Content');

// Initialize models
const models = {
    Menu,
    MegaMenu,
    SubMegaMenu,
    Content
};

// Set up associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models; 