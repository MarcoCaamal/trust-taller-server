// src/app.test.ts
import request from 'supertest';
import app from '../src/app';
import { describe, it, expect } from '@jest/globals';

describe('GET /health', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});

describe('Problem Details errors', () => {
  it('should return RFC9457 body for validation errors', async () => {
    const response = await request(app).post('/api/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toContain('application/problem+json');
    expect(response.body.type).toBe('https://trust-taller.dev/problems/validation-error');
    expect(response.body.status).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});
