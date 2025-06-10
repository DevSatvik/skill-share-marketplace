// tests/providerTasks.test.js
import request from 'supertest';
import app from '../server.js';

let userAuthToken;
let providerAuthToken;
let taskA;
let taskB;

beforeAll(async () => {
  // 1) register + login provider
  await request(app).post('/api/register').send({
    role: 'PROVIDER',
    type: 'INDIVIDUAL',
    email: 'prov-list@example.com',
    password: 'password123',
    mobileNumber: '0000000001',
    firstName: 'Prov',
    lastName: 'List',
    addressStreetNumber: '1',
    addressStreetName: 'Prov St',
    addressCitySuburb: 'City',
    addressState: 'State',
    addressPostcode: '00001',
  });
  let res = await request(app).post('/api/login').send({
    email: 'prov-list@example.com',
    password: 'password123',
  });
  providerAuthToken = res.body.authToken;

  // 2) register + login user
  await request(app).post('/api/register').send({
    role: 'USER',
    type: 'INDIVIDUAL',
    email: 'user-list@example.com',
    password: 'password123',
    mobileNumber: '0000000002',
    firstName: 'User',
    lastName: 'List',
    addressStreetNumber: '2',
    addressStreetName: 'User St',
    addressCitySuburb: 'City',
    addressState: 'State',
    addressPostcode: '00002',
  });
  res = await request(app).post('/api/login').send({
    email: 'user-list@example.com',
    password: 'password123',
  });
  userAuthToken = res.body.authToken;

  // 3) Task A: provider offers & is accepted
  const a = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      category: 'CLEANING',
      taskName: 'Accepted Task',
      taskDescription: 'For listing test',
      expectedStartDate: new Date().toISOString(),
      expectedHours: 2,
      hourlyRate: 20,
      currency: 'USD',
    });
  taskA = a.body.task.id;

  const oa = await request(app)
    .post('/api/offers')
    .set('Authorization', `Bearer ${providerAuthToken}`)
    .send({ taskId: taskA });

  await request(app)
    .post(`/api/offers/${oa.body.offer.id}/accept`)
    .set('Authorization', `Bearer ${userAuthToken}`);

  // 4) Task B: provider does NOT offer
  const b = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${userAuthToken}`)
    .send({
      category: 'CLEANING',
      taskName: 'Unseen Task',
      taskDescription: 'Should not appear',
      expectedStartDate: new Date().toISOString(),
      expectedHours: 2,
      hourlyRate: 20,
      currency: 'USD',
    });
  taskB = b.body.task.id;
});

describe('Provider Task Listing', () => {
  it('TASKS (provider): provider can list only tasks they’ve been accepted for', async () => {
    const res = await request(app)
      .get('/api/tasks/provider/accepted')
      .set('Authorization', `Bearer ${providerAuthToken}`);
    expect(res.statusCode).toBe(200);
    const ids = res.body.tasks.map(t => t.id);
    expect(ids).toContain(taskA);
    expect(ids).not.toContain(taskB);
  });

  it('TASKS (provider): when none are accepted, returns empty list', async () => {
    // register+login a brand new provider with no offers
    await request(app).post('/api/register').send({
      role: 'PROVIDER',
      type: 'INDIVIDUAL',
      email: 'newprov-list@example.com',
      password: 'password123',
      mobileNumber: '0000000003',
      firstName: 'New',
      lastName: 'Prov',
      addressStreetNumber: '3',
      addressStreetName: 'New St',
      addressCitySuburb: 'City',
      addressState: 'State',
      addressPostcode: '00003',
    });
    const rr = await request(app).post('/api/login').send({
      email: 'newprov-list@example.com',
      password: 'password123',
    });
    const newToken = rr.body.authToken;

    const res = await request(app)
      .get('/api/tasks/provider/accepted')
      .set('Authorization', `Bearer ${newToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks).toHaveLength(0);
  });
});
