import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
    <main className="max-w-4xl mx-auto px-6 py-8">
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
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Fully Discharged Voltage:</span>
                  <span 
                    className="text-gray-900 font-semibold"
                    data-testid="text-fully-discharged-voltage"
                  >
                    {currentBattery.emptyVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Advisable Discharge Voltage:</span>
                  <span 
                    className="text-gray-900 font-semibold"
                    data-testid="text-advisable-discharge-voltage"
                  >
                    {getAdvisableDischargeVoltage(selectedChemistry, selectedCells)}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Storage Voltage:</span>
                  <span 
                    className="text-gray-900 font-semibold"
                    data-testid="text-storage-voltage"
                  >
                    {currentBattery.storageVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Nominal Voltage:</span>
                  <span 
                    className="text-gray-900 font-semibold"
                    data-testid="text-nominal-voltage"
                  >
                    {currentBattery.nominalVoltage}V
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Charged Voltage:</span>
                  <span 
                    className="text-gray-900 font-semibold"
                    data-testid="text-charged-voltage"
                  >
                    {currentBattery.fullVoltage}V
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
      </div>
    </main>
  );
}
