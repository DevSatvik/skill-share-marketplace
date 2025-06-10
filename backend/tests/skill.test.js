// tests/skill.test.js
import request from 'supertest';
import app from '../server.js';
import { userAuthToken, providerAuthToken } from './account.test.js';

describe('Skill Restrictions', () => {
  it('SKILL: provider can create a skill', async () => {
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${providerAuthToken}`)
      .send({
        category: 'GARDENING',
        experienceYears: 1,
        workNature: 'ONSITE',
        hourlyRate: 25,
        currency: 'USD',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.skill).toHaveProperty('id');
  });

  it('SKILL: user is forbidden from creating a skill', async () => {
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${userAuthToken}`)
      .send({
        category: 'CLEANING',
        experienceYears: 2,
        workNature: 'ONLINE',
        hourlyRate: 30,
        currency: 'USD',
      });
    expect(res.statusCode).toBe(403);
  });
});
