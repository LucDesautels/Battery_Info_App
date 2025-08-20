export interface BatteryData {
  chemistry: string;
  cells: string;
  emptyVoltage: number;
  storageVoltage: number;
  nominalVoltage: number;
  fullVoltage: number;
}

export type Chemistry = 'LiPo' | 'Li-ion' | 'LiFePO4' | 'NiMH';
export type CellCount = '1S' | '2S' | '3S' | '4S' | '5S' | '6S' | '7S' | '8S';
