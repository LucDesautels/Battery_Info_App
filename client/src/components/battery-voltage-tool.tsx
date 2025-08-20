import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseBatteryCSV } from '@/lib/csv-parser';
import type { BatteryData, Chemistry, CellCount } from '@/types/battery';
import { cn } from '@/lib/utils';

export default function BatteryVoltageTool() {
  const [selectedChemistry, setSelectedChemistry] = useState<Chemistry>('Li-ion');
  const [selectedCells, setSelectedCells] = useState<CellCount>('3S');

  const { data: batteryData, isLoading, error } = useQuery({
    queryKey: ['/api/battery-data'],
    queryFn: parseBatteryCSV,
  });

  const chemistryOptions: Chemistry[] = ['LiPo', 'Li-ion', 'LiFePO4', 'NiMH'];
  const cellOptions: CellCount[] = ['1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S'];

  // Find current battery data
  const currentBattery = batteryData?.find(
    (battery) => battery.chemistry === selectedChemistry && battery.cells === selectedCells
  );

  // Helper function to check if NiMH 3S+
  const isNiMHThreePlusS = (chemistry: Chemistry, cells: CellCount) => {
    if (chemistry !== 'NiMH') return false;
    const cellNumber = parseInt(cells.replace('S', ''));
    return cellNumber >= 3;
  };

  // Helper function to calculate advisable discharge voltage
  const getAdvisableDischargeVoltage = (chemistry: Chemistry, cells: CellCount) => {
    const cellNumber = parseInt(cells.replace('S', ''));
    const perCellVoltage = {
      'Li-ion': 3.2,
      'LiPo': 3.2,
      'LiFePO4': 2.8,
      'NiMH': 1.1
    };
    return (perCellVoltage[chemistry] * cellNumber).toFixed(1);
  };

  // Voltage to SOC data for each chemistry
  const voltageSOCData = {
    'Li-ion': [
      { voltage: 4.20, soc: 100 },
      { voltage: 4.10, soc: 95 },
      { voltage: 4.00, soc: 90 },
      { voltage: 3.90, soc: 80 },
      { voltage: 3.80, soc: 70 },
      { voltage: 3.70, soc: 60 },
      { voltage: 3.60, soc: 45 },
      { voltage: 3.50, soc: 30 },
      { voltage: 3.40, soc: 15 },
      { voltage: 3.30, soc: 7 },
      { voltage: 3.20, soc: '~5%' },
      { voltage: 3.00, soc: 0 }
    ],
    'LiPo': [
      { voltage: 4.20, soc: 100 },
      { voltage: 4.10, soc: 95 },
      { voltage: 4.00, soc: 90 },
      { voltage: 3.90, soc: 80 },
      { voltage: 3.85, soc: 75 },
      { voltage: 3.80, soc: 70 },
      { voltage: 3.70, soc: 55 },
      { voltage: 3.60, soc: 40 },
      { voltage: 3.50, soc: 25 },
      { voltage: 3.40, soc: 12 },
      { voltage: 3.30, soc: '~5%' },
      { voltage: 3.20, soc: '0% Advisable discharge' },
      { voltage: 3.00, soc: '0% Fully Discharged' }
    ],
    'LiFePO4': [
      { voltage: 3.65, soc: 100 },
      { voltage: 3.40, soc: 90 },
      { voltage: 3.30, soc: 70 },
      { voltage: 3.25, soc: 50 },
      { voltage: 3.20, soc: 30 },
      { voltage: 3.10, soc: 15 },
      { voltage: 3.00, soc: 7 },
      { voltage: 2.80, soc: 0 }
    ],
    'NiMH': [
      { voltage: 1.45, soc: 100 },
      { voltage: 1.35, soc: 80 },
      { voltage: 1.30, soc: 60 },
      { voltage: 1.25, soc: 40 },
      { voltage: 1.20, soc: 20 },
      { voltage: 1.10, soc: 10 },
      { voltage: 1.00, soc: 0 }
    ]
  };

  // Commentary for each chemistry
  const chemistryCommentary = {
    'Li-ion': 'Lithium-ion (NMC/LCO/NCA, 3.6-3.7V nominal). In RC/drone use, people often treat 3.5V = "empty" under load to protect packs.',
    'LiPo': 'Lithium-polymer (LiPo, pouch type, same chemistry as above). Voltages essentially identical to Li-ion, but hobbyists often keep a larger buffer for pack safety.',
    'LiFePO4': 'Lithium iron phosphate (LiFePO4, 3.2V nominal). Very flat mid-range; voltage isn\'t as good an SoC indicator here.',
    'NiMH': 'Nickel-metal hydride (NiMH, 1.2V nominal). Voltage is a poor % indicator - capacity is usually tracked by mAh in/out. But rough OCV estimates are possible.'
  };

  // Calculate voltage for specific cell count
  const calculateVoltageForCells = (singleCellVoltage: number, cells: CellCount) => {
    const cellNumber = parseInt(cells.replace('S', ''));
    return (singleCellVoltage * cellNumber).toFixed(2);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error loading battery data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 pl-[0px] pr-[0px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Battery Chemistry Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Battery Chemistry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {chemistryOptions.map((chemistry) => (
                <Button
                  key={chemistry}
                  variant={selectedChemistry === chemistry ? "default" : "outline"}
                  onClick={() => setSelectedChemistry(chemistry)}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    selectedChemistry === chemistry
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  )}
                  data-testid={`button-chemistry-${chemistry.toLowerCase()}`}
                >
                  {chemistry}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cell Count Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Cell Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {cellOptions.map((cells) => {
                const isGreyedOut = isNiMHThreePlusS(selectedChemistry, cells);
                return (
                  <Button
                    key={cells}
                    variant={selectedCells === cells ? "default" : "outline"}
                    onClick={() => setSelectedCells(cells)}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      selectedCells === cells
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
                      isGreyedOut && "opacity-60"
                    )}
                    data-testid={`button-cells-${cells.toLowerCase()}`}
                  >
                    {cells === '1S' ? 'Single Cell' : cells}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Voltage Information Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              <span data-testid="text-battery-display">
                {selectedCells} {selectedChemistry}
              </span>{' '}
              Battery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : currentBattery ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-green-50">
                  <span className="text-gray-600 font-medium">Charged Voltage:</span>
                  <span 
                    className="text-green-800 font-semibold"
                    data-testid="text-charged-voltage"
                  >
                    {currentBattery.fullVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-purple-50">
                  <span className="text-gray-600 font-medium">Nominal Voltage:</span>
                  <span 
                    className="text-purple-800 font-semibold"
                    data-testid="text-nominal-voltage"
                  >
                    {currentBattery.nominalVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-blue-50">
                  <span className="text-gray-600 font-medium">Storage Voltage:</span>
                  <span 
                    className="text-blue-800 font-semibold"
                    data-testid="text-storage-voltage"
                  >
                    {currentBattery.storageVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-orange-50">
                  <span className="text-gray-600 font-medium">Advisable Discharge Voltage:</span>
                  <span 
                    className="text-orange-800 font-semibold"
                    data-testid="text-advisable-discharge-voltage"
                  >
                    {getAdvisableDischargeVoltage(selectedChemistry, selectedCells)}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-red-50">
                  <span className="text-gray-600 font-medium">Fully Discharged Voltage:</span>
                  <span 
                    className="text-red-800 font-semibold"
                    data-testid="text-fully-discharged-voltage"
                  >
                    {currentBattery.emptyVoltage}V
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No data available for this configuration
              </div>
            )}
          </CardContent>
        </Card>

        {/* Battery % to Voltage Chart */}
        <div className="lg:col-span-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900">
                Voltage %SOC (state of charge) <span className="font-bold">Estimation</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {chemistryCommentary[selectedChemistry]}
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">1S {selectedChemistry} Voltage</TableHead>
                        <TableHead className="font-semibold">{selectedCells} {selectedChemistry} Voltage</TableHead>
                        <TableHead className="font-semibold">%SOC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {voltageSOCData[selectedChemistry].map((data, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell>
                            {data.voltage.toFixed(2)}V
                          </TableCell>
                          <TableCell>
                            {calculateVoltageForCells(data.voltage, selectedCells)}V
                          </TableCell>
                          <TableCell>
                            {typeof data.soc === 'number' ? `${data.soc}%` : data.soc}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {selectedChemistry === 'NiMH' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Note: 1.45V represents fresh off charger with surface charge
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
