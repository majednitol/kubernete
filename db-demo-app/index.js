const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME;
const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;



// Connect to PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
    host: DB_HOST, // Change this if you're using Docker or a different host
    port: DB_PORT,
    dialect: 'postgres',
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Connection to PostgreSQL has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Define a Sequelize model
const Email = sequelize.define('Email', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Sync the model with the database
sequelize.sync();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', async (req, res) => {
    const { email } = req.body;
    try {
        const newEmail = await Email.create({ email });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding email');
    }
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.findAll();
        res.json(emails);
    } catch (error) {
        res.status(500).send('Error fetching emails');
    }
});

app.get('/exit', (req, res) => {
    // Perform actions to stop the server or any other desired actions
    res.send('Server stopped');
    process.exit(0); // This stops the server (not recommended in production)
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
