const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');
const menuRoutes = require('./routes/menuRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database sync and authentication
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        // Force sync in development
        const shouldForce = process.env.NODE_ENV === 'development' && process.env.DBSYNC === 'true';
        console.log('Syncing database with force =', shouldForce);
        return db.sequelize.sync({ force: shouldForce });
    })
    .then(() => {
        console.log('Database synced successfully');
        // Log all models and their attributes
        Object.keys(db.sequelize.models).forEach(modelName => {
            console.log(`Model ${modelName} attributes:`,
                Object.keys(db.sequelize.models[modelName].rawAttributes));
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// # npx sequelize-cli db:migrate
// # npx sequelize-cli db:seed
// # npx sequelize-cli db:seed:all
// # npx sequelize-cli db:create

// # npx sequelize-cli db:migrate:undo:all
// # npx sequelize-cli db:migrate
// # npx sequelize-cli db:seed:all

// # npx sequelize-cli db:seed:undo:all
// # npx sequelize-cli db:seed

// # npx sequelize-cli db:seed:undo
