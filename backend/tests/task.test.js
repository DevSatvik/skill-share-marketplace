// tests/task.test.js
import request from 'supertest';
import app from '../server.js';
import { userAuthToken, providerAuthToken } from './account.test.js';

let taskId = 0;

describe('Task Restrictions', () => {
  it('TASK: user can create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userAuthToken}`)
      .send({
        category: 'TUTORING',
        taskName: 'My Task',
        taskDescription: 'Do something',
        expectedStartDate: new Date().toISOString(),
        expectedHours: 2,
        hourlyRate: 40,
        currency: 'USD',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('task');
    taskId = res.body.task.id;
  });

  it('TASK: provider is forbidden from creating a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({
        category: 'CLEANING',
        taskName: 'Bad Task',
        taskDescription: 'Should fail',
        expectedStartDate: new Date().toISOString(),
        expectedHours: 1,
        hourlyRate: 20,
        currency: 'USD',
      });
    expect(res.statusCode).toBe(403);
  });

  it('TASK: user can update their own task details', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userAuthToken}`)
      .send({ taskName: 'Updated Task' });
    expect(res.statusCode).toBe(200);
    expect(res.body.task.taskName).toBe('Updated Task');
  });

  it('TASK: provider (non-owner) is forbidden from updating a user’s task', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({ taskName: 'Hacked' });
    expect(res.statusCode).toBe(403);
  });

  it('TASKS (user): user can list only their own posted tasks', async () => {
    const res = await request(app)
      .get('/api/tasks/user/posted')
      .set('Authorization', `Bearer ${userAuthToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    // should see at least the one we just created
    expect(res.body.tasks.find(t => t.id === taskId)).toBeDefined();
  });

  it('TASKS (user): user is forbidden from listing another user’s posted tasks', async () => {
    const res = await request(app)
      .get('/api/tasks/user/posted')
      .set('Authorization', `Bearer ${providerAuthToken}`);
    expect(res.statusCode).toBe(403);
  });
});
