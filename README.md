This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the tests:

## Unit tests
```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test

```

## Lint
```bash
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint

```

Then, run the server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Manual testing

```bash
curl -X POST http://localhost:3000/api/quality-control -d "reference 70.0 45.0 6
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
2007-04-05T22:04 6"
```


## Deployed on Vercel

If you'd like to test this without running on your local environment simply:

```bash
curl -X POST https://quality-control-app.vercel.app/api/quality-control -d "reference 70.0 45.0 6
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
2007-04-05T22:04 6"
```

## Recommendations for Log File Format and API Output Improvements

### Log File Format Improvements

1. **JSON Format**: Transition from a custom text format to JSON. JSON is a widely accepted format that is easy to parse and read.
2. **Timestamp Standardization**: Use a standardized timestamp format like ISO 8601 for consistency.
3. **Sensor Metadata**: Include metadata for sensors, such as type and name, within each log entry.

**Example JSON Log:**
```json
{
  "reference": {
    "temperature": 70.0,
    "humidity": 45.0,
    "monoxide": 6
  },
  "readings": [
    {
      "sensorType": "thermometer",
      "sensorName": "temp-1",
      "data": [
        {"timestamp": "2007-04-05T22:00:00Z", "value": 72.4},
        {"timestamp": "2007-04-05T22:01:00Z", "value": 76.0}
        // More entries...
      ]
    },
    {
      "sensorType": "humidity",
      "sensorName": "hum-1",
      "data": [
        {"timestamp": "2007-04-05T22:00:00Z", "value": 45.2},
        {"timestamp": "2007-04-05T22:01:00Z", "value": 45.3}
        // More entries...
      ]
    }
    // More sensors...
  ]
}
```

### API Output Improvements

1. **Consistent JSON Output**: Ensure the API returns consistent JSON responses with clear status messages.
2. **Detailed Results**: Provide more detailed results for each sensor, including metadata and evaluation results.


**Example JSON API Output:**
```json
{
  "status": "success",
  "results": [
    {
      "sensorName": "temp-1",
      "sensorType": "thermometer",
      "evaluation": "precise",
      "mean": 70.0,
      "stddev": 3.0
    },
    {
      "sensorName": "hum-1",
      "sensorType": "humidity",
      "evaluation": "keep"
    }
    // More results...
  ]
}

```

### Scalability and Addition of New Sensors ###

1. **Modular Design**: Use a modular design where each sensor type has its own evaluation function. This allows for easy addition of new sensor types. (Implemented in this commit)
2. **Configuration-Driven**: Use configuration files or a database to manage sensor types and their evaluation criteria. This makes it easy to add or modify sensor types without changing the code.
3. **Database Integration**: Store log data and evaluation results in a database. This supports querying, scalability, and integration with other systems.
4. **API Versioning**: Implement API versioning to support future changes without breaking existing clients.

```javascript
// Define a map of evaluation functions
const evaluationFunctions: Record<string, (data: SensorData, reference: ReferenceValues) => string> = {
  thermometer: evaluateThermometer,
  humidity: evaluateHumidity,
  monoxide: evaluateMonoxide,
  // Add new sensor types here
};

const evaluateSensor = (sensor: SensorData, reference: ReferenceValues): string => {
  const evaluate = evaluationFunctions[sensor.type];
  return evaluate ? evaluate(sensor, reference) : 'unknown';
};

const evaluateThermometer = (sensor: SensorData, reference: ReferenceValues): string => {
  const values = sensor.readings.map(entry => entry.value);
  if (values.length === 0) {
    return 'unknown';
  }
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stddev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
  if (Math.abs(mean - reference.temperature) <= 0.5 && stddev < 5) {
    return 'ultra precise';
  } else {
    return 'precise';
  }
};

// Similar evaluation functions for humidity and monoxide
```

### Summary of Recommendations ###

1. **Log File Format**: Transition to JSON, standardize timestamps, and include sensor metadata within each entry.
2. **API Output**: Provide consistent, detailed JSON responses with clear status messages.
3. **Scalability**: Use a modular design for evaluation functions, configuration-driven sensor management, database integration, and API versioning.

These changes will improve the clarity and usability of log files and API, and ensure that the system is scalable and easily extensible to support new sensor types in the future.