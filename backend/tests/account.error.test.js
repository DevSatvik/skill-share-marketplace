// tests/account.error.test.js
import request from 'supertest';
import app from '../server.js';

describe('Account Error Cases', () => {
  it('rejects registration with missing individual fields', async () => {
    const res = await request(app).post('/api/register').send({
      role: 'USER',
      type: 'INDIVIDUAL',
      email: 'foo@bar.com',
      password: 'pass',
      mobileNumber: '1111111111',
      // missing firstName, lastName, address...
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/firstName is required/);
  });

  it('rejects registration with missing company fields', async () => {
    const res = await request(app).post('/api/register').send({
      role: 'PROVIDER',
      type: 'COMPANY',
      email: 'biz@bar.com',
      password: 'pass',
      mobileNumber: '2222222222',
      // missing companyName, taxID, repFirstName...
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/companyName is required/);
  });

  it('rejects login with invalid credentials', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'invalid@example.com',
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('rejects /api/me without token', async () => {
    const res = await request(app).get('/api/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Authorization header is missing/);
  });
});
