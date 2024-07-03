const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
// router.get('/admin', authMiddleware.authenticate, authMiddleware.isAdmin, (req, res) => {
//   res.send('Hello Admin');
// });

module.exports = router;
