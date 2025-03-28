// __tests__/post.test.js
const request = require('supertest');
const server = require('../index');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model
const Post = require('../models/post'); // Import Post model

describe('Post API', () => {
    let token;
    let testUser;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Increase timeout here
        });


        // Create a test user and generate a JWT
        testUser = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
    }, 10000);

    afterAll(async () => {
        // await User.deleteMany({});
        await Post.deleteMany({title: 'Test Post'});
        await mongoose.connection.close();

        await server.close();
    }, 10000);

    it('should create a post with valid JWT', async () => {
        const res = await request(server)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`) // Set authorization header
            .send({
                title: 'Test Post',
                content: 'Test Content',
                author: testUser._id.toString(),
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('title', 'Test Post');
        expect(res.body.author).toBe(testUser._id.toString());
    });

    it('should fail to create post without valid JWT', async () => {
        const res = await request(server).post('/posts').send({
            title: 'Test Post',
            content: 'Test Content',
            author: testUser._id.toString(),
        });
        expect(res.statusCode).toBe(401);
    });

    // ... other integration tests
});