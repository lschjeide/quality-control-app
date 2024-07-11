import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
  time: string;
  value: number;
}

interface SensorData {
  type: string;
  name: string;
  readings: LogEntry[];
}

interface ReferenceValues {
  temperature: number;
  humidity: number;
  monoxide: number;
}

const parseLog = (log: string): { reference: ReferenceValues; sensors: SensorData[] } => {
  const lines = log.trim().split('\n');
  const referenceParts = lines[0].split(' ');
  const reference = {
    temperature: parseFloat(referenceParts[1]),
    humidity: parseFloat(referenceParts[2]),
    monoxide: parseInt(referenceParts[3], 10),
  };

  const sensors: SensorData[] = [];
  let currentSensor: SensorData | null = null;

  lines.slice(1).map((line) => {
    const parts = line.split(' ');
    if (parts.length === 2 && isNaN(parseFloat(parts[1]))) {
      if (currentSensor) {
        sensors.push(currentSensor);
      }
      currentSensor = { type: parts[0], name: parts[1], readings: [] };
    } else if (parts.length === 2 && currentSensor) {
      currentSensor.readings.push({ time: parts[0], value: parseFloat(parts[1]) });
    }
  })
    
  if (currentSensor) {
    sensors.push(currentSensor);
  }

  return { reference, sensors };
};

const evaluateSensor = (sensor: SensorData, reference: ReferenceValues): string => {
  const values = sensor.readings.map(entry => entry.value);
  
  if (values.length === 0) {
    return 'unknown';
  }

  if (sensor.type === 'thermometer') {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stddev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
    if (Math.abs(mean - reference.temperature) <= 0.5 && stddev < 5) {
      return 'ultra precise';
    } else {
      return 'precise';
    }
  } else if (sensor.type === 'humidity') {
    if (values.every(value => Math.abs(value - reference.humidity) <= 1)) {
      return 'keep';
    } else {
      return 'discard';
    }
  } else if (sensor.type === 'monoxide') {
    if (values.every(value => Math.abs(value - reference.monoxide) <= 3)) {
      return 'keep';
    } else {
      return 'discard';
    }
  }
  return 'unknown';
};

export async function POST(request: NextRequest) {
  const log = await request.text();

  const { reference, sensors } = parseLog(log);

  const result: Record<string, string> = {};
  sensors.map((sensor) => {
    result[sensor.name] = evaluateSensor(sensor, reference);
  })
  

  return NextResponse.json(result);
}
