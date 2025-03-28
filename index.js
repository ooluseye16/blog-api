const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
require('dotenv').config();

const app = express();
const PORT = 3000;
app.use(express.json());
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'blog',
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
 
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our blog api'
    });
});

app.post('/auth/register', userController.registerUser);
app.post('/auth/login', userController.loginUser);

app.get('/admin', authMiddleware.protect, roleMiddleware.authorizeRole('admin'), (req, res) => {
    res.json({
        message: 'Welcome Admin'
    });
}
);

app.get('/user', authMiddleware.protect, userController.getUser);
app.get('/users/:id', userController.getUserById);



app.post('/posts', authMiddleware.protect, postController.createPost);
app.get('/posts', postController.getPosts);
app.get('/posts/:id', postController.getPostById);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

// Conditionally start the server
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = server; 