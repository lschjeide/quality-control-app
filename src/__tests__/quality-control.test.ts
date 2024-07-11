import { NextRequest } from 'next/server';
import { POST } from '../app/api/quality-control/route';
import '@testing-library/jest-dom';

describe('POST /api/quality-control', () => {
  it('should evaluate the sensors correctly with precise and ultra precise results', async () => {
    const log = `reference 70.0 45.0 6
thermometer temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
2007-04-05T22:02 79.1
2007-04-05T22:03 75.6
2007-04-05T22:04 71.2
2007-04-05T22:05 71.4
2007-04-05T22:06 69.2
2007-04-05T22:07 65.2
2007-04-05T22:08 62.8
2007-04-05T22:09 61.4
2007-04-05T22:10 64.0
2007-04-05T22:11 67.5
2007-04-05T22:12 69.4
thermometer temp-2
2007-04-05T22:00 69.5
2007-04-05T22:01 70.1
2007-04-05T22:02 71.3
2007-04-05T22:03 71.5
2007-04-05T22:04 69.8
humidity hum-1
2007-04-05T22:00 45.2
2007-04-05T22:01 45.3
2007-04-05T22:02 45.1
humidity hum-2
2007-04-05T22:00 44.4
2007-04-05T22:01 43.9
2007-04-05T22:02 44.9
2007-04-05T22:03 43.8
2007-04-05T22:04 42.1
monoxide mon-1
2007-04-05T22:00 5
2007-04-05T22:01 7
2007-04-05T22:02 9
monoxide mon-2
2007-04-05T22:00 2
2007-04-05T22:01 4
2007-04-05T22:02 10
2007-04-05T22:03 8
2007-04-05T22:04 6`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'temp-1': 'precise',
      'temp-2': 'ultra precise',
      'hum-1': 'keep',
      'hum-2': 'discard',
      'mon-1': 'keep',
      'mon-2': 'discard',
    });
  });

  it('should handle logs where all sensors are within range', async () => {
    const log = `reference 70.0 45.0 6
thermometer temp-3
2007-04-05T22:00 70.1
2007-04-05T22:01 70.2
2007-04-05T22:02 70.0
2007-04-05T22:03 69.9
humidity hum-3
2007-04-05T22:00 45.0
2007-04-05T22:01 44.9
2007-04-05T22:02 45.1
monoxide mon-3
2007-04-05T22:00 6
2007-04-05T22:01 6
2007-04-05T22:02 5`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'temp-3': 'ultra precise',
      'hum-3': 'keep',
      'mon-3': 'keep',
    });
  });

  it('should handle logs where some sensors are out of range', async () => {
    const log = `reference 70.0 45.0 6
thermometer temp-4
2007-04-05T22:00 70.1
2007-04-05T22:01 80.2
2007-04-05T22:02 70.0
2007-04-05T22:03 69.9
humidity hum-4
2007-04-05T22:00 45.0
2007-04-05T22:01 44.9
2007-04-05T22:02 42.1
monoxide mon-4
2007-04-05T22:00 6
2007-04-05T22:01 10
2007-04-05T22:02 5`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'temp-4': 'precise',
      'hum-4': 'discard',
      'mon-4': 'discard',
    });
  });

  it('should handle empty logs', async () => {
    const log = ``;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({});
  });

  it('should handle logs with missing sensor readings', async () => {
    const log = `reference 70.0 45.0 6
thermometer temp-5`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'temp-5': 'unknown',
    });
  });

  it('should handle logs with sensor readings exactly on the threshold', async () => {
    const log = `reference 70.0 45.0 6
thermometer temp-6
2007-04-05T22:00 70.0
2007-04-05T22:01 70.5
2007-04-05T22:02 69.5
humidity hum-5
2007-04-05T22:00 45.0
2007-04-05T22:01 44.0
2007-04-05T22:02 46.0
monoxide mon-5
2007-04-05T22:00 6
2007-04-05T22:01 9
2007-04-05T22:02 3`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'temp-6': 'ultra precise',
      'hum-5': 'keep',
      'mon-5': 'keep',
    });
  });

  it('should handle logs with unknown sensor types', async () => {
    const log = `reference 70.0 45.0 6
unknownsensor unknown-1
2007-04-05T22:00 70.0
2007-04-05T22:01 70.5`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'unknown-1': 'unknown',
    });
  });

  it('should handle logs with no sensors defined', async () => {
    const log = `reference 70.0 45.0 6`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({});
  });

  it('should handle logs with no data for humidity sensor', async () => {
    const log = `reference 70.0 45.0 6
humidity hum-6`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'hum-6': 'unknown',
    });
  });

  it('should handle logs with no data for monoxide sensor', async () => {
    const log = `reference 70.0 45.0 6
monoxide mon-6`;

    const nextReq = new NextRequest('http://localhost/api/quality-control', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: log,
    });

    const nextRes = await POST(nextReq);
    const json = await nextRes.json();

    expect(nextRes.status).toBe(200);
    expect(json).toEqual({
      'mon-6': 'unknown',
    });
  });
});
