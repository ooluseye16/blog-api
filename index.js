const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const cors = require('cors');
const { upload } = require('./config/cloudinaryConfig');


const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'blog',
    serverSelectionTimeoutMS: 30000,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API',
            version: '1.0.0',
            description: 'API documentation for the Blog application',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, // Change this to your production URL
            },
        ],
    },
    apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our blog api'
    });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "67e6d9812c190f2ab7def82b"
 *         username:
 *           type: string
 *           example: "testuser"
 *         email:
 *           type: string
 *           example: "testuser@example.com"
 *         role:
 *           type: string
 *           example: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-03-28T17:16:49.950Z"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Please provide username, email and password"
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *           example: "User registered successfully"
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "67e6d9812c190f2ab7def82b"
 *         title:
 *           type: string
 *           example: "My first post"
 *         content:
 *           type: string
 *           example: "This is my first post"
 *         author:
 *           type: string
 *           example: "67e6d9812c190f2ab7def82b"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-03-28T17:16:49.950Z"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/auth/register', userController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTZkOTgxMmMxOTBmMmFiN2RlZjgyYiIsImlhdCI6MTYyMzA3NzUwOCwiZXhwIjoxNjIzMDgxMTA4fQ.6j5vP6tR7D9z0z7QVw8Wt5Q9W5RmQs"
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 */
app.post('/auth/login', userController.loginUser);

app.get('/admin', authMiddleware.protect, roleMiddleware.authorizeRole('admin'), (req, res) => {
    res.json({
        message: 'Welcome Admin'
    });
}
);

//get user with Authorization token
/**
 *  @swagger
 * /user:
 *   get:
 *     summary: Get user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
app.get('/user', authMiddleware.protect, userController.getUser);

// Get user by id
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
app.get('/users/:id', userController.getUserById);


//Get all Posts
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
app.get('/posts', postController.getPosts);

// Create a new post
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 * 
 */
app.post('/posts', authMiddleware.protect, upload.single('image'), postController.createPost);
app.get('/posts/:id', postController.getPostById);
app.get('/user/posts', authMiddleware.protect, postController.getUserPosts);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

// Conditionally start the server
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = server; 