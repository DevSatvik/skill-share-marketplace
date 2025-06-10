// tests/progress.test.js
import request from 'supertest';
import app from '../server.js';

let userAuthToken;
let providerAuthToken;
let taskId;
let offerId;

beforeAll(async () => {
  // 1) register + login provider
  await request(app).post('/api/register').send({
    role: 'PROVIDER',
    type: 'INDIVIDUAL',
    email: 'prov@example.com',
    password: 'password',
    mobileNumber: '0000000001',
    firstName: 'Prov',
    lastName: 'A',
    addressStreetNumber: '1',
    addressStreetName: 'Prov St',
    addressCitySuburb: 'City',
    addressState: 'State',
    addressPostcode: '0000',
  });
  let res = await request(app).post('/api/login').send({
    email: 'prov@example.com',
    password: 'password',
  });
  providerAuthToken = res.body.authToken;

  // 2) register + login user
  await request(app).post('/api/register').send({
    role: 'USER',
    type: 'INDIVIDUAL',
    email: 'user@example.com',
    password: 'password',
    mobileNumber: '0000000002',
    firstName: 'User',
    lastName: 'B',
    addressStreetNumber: '2',
    addressStreetName: 'User St',
    addressCitySuburb: 'City',
    addressState: 'State',
    addressPostcode: '0000',
  });
  res = await request(app).post('/api/login').send({
    email: 'user@example.com',
    password: 'password',
  });
  userAuthToken = res.body.authToken;

  // 3) create & accept an offer so progress happy-path can run
  const t = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      category: 'TUTORING',
      taskName: 'Progress Task',
      taskDescription: 'Testing progress',
      expectedStartDate: new Date().toISOString(),
      expectedHours: 1,
      hourlyRate: 10,
      currency: 'USD',
    });
  taskId = t.body.task.id;

  const o = await request(app)
    .post('/api/offers')
    .set('Authorization', `Bearer ${providerAuthToken}`)
    .send({ taskId });
  offerId = o.body.offer.id;

  await request(app)
    .post(`/api/offers/${offerId}/accept`)
    .set('Authorization', `Bearer ${userAuthToken}`);
});

describe('Progress Restrictions', () => {
  it('PROGRESS: provider with accepted offer can post progress', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/progress`)
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({ progressDescription: 'Half done' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('progress');
  });

  it('PROGRESS: provider whose offer is not accepted is forbidden', async () => {
    // create second task & offer (never accepted)
    const t2 = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userAuthToken}`)
      .send({
        category: 'TUTORING',
        taskName: 'NoAccept',
        taskDescription: 'Should fail progress',
        expectedStartDate: new Date().toISOString(),
        expectedHours: 1,
        hourlyRate: 10,
        currency: 'USD',
      });
    const tid2 = t2.body.task.id;

    await request(app)
      .post('/api/offers')
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({ taskId: tid2 });

    const res = await request(app)
      .post(`/api/tasks/${tid2}/progress`)
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({ progressDescription: 'Too soon' });
    expect(res.statusCode).toBe(403);
  });
});
