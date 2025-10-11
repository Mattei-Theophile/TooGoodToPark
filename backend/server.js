require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors')
const { Api } = require('./api/api')
const { apiLogger } = require('./services/logger')
const colors = require('colors')

const loginRoutes = require('./api/routes/login');
const { authenticateToken } = require('./services/login/auth');

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
// API request/response logging middleware (applies to all /api/* routes)
app.use('/api', apiLogger);
app.use('/uploads', express.static('uploads'));
app.disable('x-powered-by');


// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

const api = new Api(app)
api.start()


app.listen(PORT, () => {
    console.log(colors.green(`✔ Server is running on port ${PORT}`));
});