const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require('./routes/auth');
const authController = require('./controllers/authController');

const DB_PATH = "mongodb+srv://task-manager:ssjy2311@cluster0.uxjmghk.mongodb.net/task-manager?appName=Cluster0";
const port = 3000;

const app = express();

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

store.on('error', function (error) {
    console.log('Session store error:', error);
});

// Middlewares
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

app.use(session({
    secret: 'task-manager-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Set req.isLoggedIn from session for use in controllers
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

// Routes
app.use('/api/auth', authRouter);
app.get('/auth-status', authController.getAuthStatus);
app.post('/logout', authController.postLogout);

// Debug endpoint - check raw session (remove in production)
app.get('/debug-session', (req, res) => {
    res.json({
        sessionID: req.sessionID,
        session: req.session,
        cookies: req.headers.cookie
    });
});

mongoose.connect(DB_PATH)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch(err => {
        console.log("Error while connecting to MongoDB:", err);
    });