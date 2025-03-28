const request = require('supertest');
const server = require('../index'); // Import your server
const mongoose = require('mongoose');
const User = require('../models/user');

describe('User API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
    }, 10000);

    afterAll(async () => {
        //delete all users taht contains example.com
        await User.deleteMany({ email: /example.com/ });
        await mongoose.connection.close();
        await server.close();
    }, 10000);

    it('should register a new user', async () => {
        const res = await request(server).post('/auth/register').send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should fail to register a user with duplicate username', async () => {
        const res = await request(server).post('/auth/register').send({
            username: 'newuser', // Using the same username as the previous test
            email: 'another@example.com',
            password: 'password456',
        });
        // console.log(res.body);

        expect(res.statusCode).toBe(500); // Or the status code your server sends for this error
        expect(res.body).toHaveProperty("status", "error");
    });

    it('should login an existing user', async () => {
        const res = await request(server).post('/auth/login').send({
            email: 'newuser@example.com',
            password: 'password123',
        });
        // console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with incorrect password', async () => {
        const res = await request(server).post('/auth/login').send({
            email: 'newuser@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('status', 'error');
    });

    it('should fail to login with incorrect email', async () => {
        const res = await request(server).post('/auth/login').send({
            email: 'wrong@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('status', 'error');
    });
});