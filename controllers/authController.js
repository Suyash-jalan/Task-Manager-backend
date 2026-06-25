const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res, next) => {
    res.json({ message: "login endpoint", isLoggedIn: req.isLoggedIn || false });
}

exports.getSignup = (req, res, next) => {
    res.json({ message: "signup", isLoggedIn: req.isLoggedIn || false });
}

exports.postSignup = [
    check('firstName')
        .trim()
        .isLength({ min: 2 })
        .withMessage("First Name should be atleast 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First Name should contain only alphabets"),

    check('lastName')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Last Name should contain only alphabets"),

    check('email')
        .isEmail()
        .withMessage("please enter a valid email")
        .normalizeEmail(),

    check("password")
        .isLength({ min: 8 })
        .withMessage("Password should be atleast 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password should contain atleast one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password should contain atleast one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password should contain atleast one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password should contain atleast one special character")
        .trim(),

    check("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords not match");
            }
            return true;
        }),

    (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().map(err => err.msg),
            });
        }

        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({ firstName, lastName, email, password: hashedPassword });
                return user.save();
            })
            .then(() => {
                res.json({ message: "User registered successfully" });
            }).catch(err => {
                return res.status(422).json({ errors: [err.message] });
            });
    }];



exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
    
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "Login failed to save session", error: err.message || err });
        }
        res.json({ message: "Login successful" });
    });

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
    });
};

exports.getAuthStatus = (req, res, next) => {
    res.json({
        isLoggedIn: req.isLoggedIn || false,
        user: req.session ? req.session.user : null
    });
};


