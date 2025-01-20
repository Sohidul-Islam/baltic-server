const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const menuRoutes = require('./routes/menuRoutes');
const contentRoutes = require('./routes/contentRoutes');
const ErrorMiddleware = require('./middlewares/Error.middleware');
const subMegaMenuRoutes = require('./routes/subMegaMenuRoutes');
const imageRoutes = require('./routes/imageRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Database authentication only (no sync)
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Add route validation middleware


// Routes with validation
app.use('/api/menu', menuRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/submenu', subMegaMenuRoutes);
app.use('/api/images', imageRoutes);


// Error handling
app.use(ErrorMiddleware);

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
