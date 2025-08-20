import Papa from 'papaparse';
import type { BatteryData } from '@/types/battery';

export async function parseBatteryCSV(): Promise<BatteryData[]> {
  try {
    const response = await fetch('/api/battery-data');
    const csvText = await response.text();
    
    const result = Papa.parse<string[]>(csvText, {
      skipEmptyLines: true,
    });

    // Skip header row and parse data
    const batteryData: BatteryData[] = result.data.slice(1).map((row) => ({
      chemistry: row[0],
      cells: row[1],
      emptyVoltage: parseFloat(row[2]),
      storageVoltage: parseFloat(row[3]),
      nominalVoltage: parseFloat(row[4]),
      fullVoltage: parseFloat(row[5]),
    }));

    return batteryData;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to load battery data');
  }
}
