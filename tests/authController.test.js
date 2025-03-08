const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app');
require('dotenv').config(); // Încarcă variabilele de mediu din fișierul .env

// Se conectează la baza de date înainte de toate testele
beforeAll(async () => {
  const url = process.env.MONGO_URI; // Utilizează variabila de mediu pentru URL-ul bazei de date
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Șterge utilizatorii existenți și creează un utilizator de test înainte de fiecare test
beforeEach(async () => {
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('password', 10);
  await User.create({
    email: 'authuser@example.com',
    password: hashedPassword,
    subscription: 'free',
  });
});

// Închide conexiunea după toate testele
afterAll(async () => {
  await mongoose.connection.close();
});

// Teste pentru ruta POST /api/users/login
describe('POST /api/users/login', () => {
  it('should respond with a status code 200 and return a token', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'authuser@example.com', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      email: 'authuser@example.com',
      subscription: 'free',
    });
  });

  it('should respond with a status code 401 for incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'wronguser@example.com', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Email sau parolă incorectă');
  });
});
