// tests/account.test.js
import request from 'supertest';
import app from '../server.js';

let providerAuthToken = '';
let userAuthToken = '';

describe('Account Routes (happy path)', () => {
  it('registers a new provider (COMPANY)', async () => {
    const res = await request(app).post('/api/register').send({
      role: 'PROVIDER',
      type: 'COMPANY',
      email: 'provider@example.com',
      password: 'password123',
      mobileNumber: '0987654321',
      companyName: 'TestCorp',
      companyPhoneNumber: '1234509876',
      taxID: 'TAX1234567',
      repFirstName: 'Alice',
      repLastName: 'Smith',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('authToken');
    providerAuthToken = res.body.authToken;
  });

  it('logs in the provider', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'provider@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('authToken');
    providerAuthToken = res.body.authToken;
  });

  it('registers a new user (INDIVIDUAL)', async () => {
    const res = await request(app).post('/api/register').send({
      role: 'USER',
      type: 'INDIVIDUAL',
      email: 'user@example.com',
      password: 'password123',
      mobileNumber: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      addressStreetNumber: '123',
      addressStreetName: 'Main St',
      addressCitySuburb: 'Cityville',
      addressState: 'Stateland',
      addressPostcode: '12345',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('authToken');
    userAuthToken = res.body.authToken;
  });

  it('logs in the user', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('authToken');
    userAuthToken = res.body.authToken;
  });
});

export { providerAuthToken, userAuthToken };
