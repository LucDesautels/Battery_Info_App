import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { parseBatteryCSV } from '@/lib/csv-parser';
import type { BatteryData, Chemistry } from '@/types/battery';

export default function Chart() {
  const { data: batteryData, isLoading, error } = useQuery({
    queryKey: ['/api/battery-data'],
    queryFn: parseBatteryCSV,
  });

  // Helper function to calculate advisable discharge voltage
  const getAdvisableDischargeVoltage = (chemistry: Chemistry, cells: string) => {
    const cellNumber = parseInt(cells.replace('S', ''));
    const perCellVoltage: Record<Chemistry, number> = {
      'Li-ion': 3.2,
      'LiPo': 3.2,
      'LiFePO4': 2.8,
      'NiMH': 1.1
    };
    return (perCellVoltage[chemistry] * cellNumber).toFixed(1);
  };

  // Group data by chemistry for better organization
  const groupedData = batteryData?.reduce((acc, battery) => {
    if (!acc[battery.chemistry]) {
      acc[battery.chemistry] = [];
    }
    acc[battery.chemistry].push(battery);
    return acc;
  }, {} as Record<string, BatteryData[]>) || {};

  // Get chemistry badge color
  const getChemistryColor = (chemistry: string) => {
    const colors: Record<string, string> = {
      'LiPo': 'bg-blue-100 text-blue-800',
      'Li-ion': 'bg-green-100 text-green-800',
      'LiFePO4': 'bg-yellow-100 text-yellow-800',
      'NiMH': 'bg-purple-100 text-purple-800'
    };
    return colors[chemistry] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error loading battery data. Please try again.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Battery Voltage Reference Chart</h1>
          <p className="text-gray-600">Complete voltage specifications for different battery chemistries and configurations</p>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex space-x-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedData).map(([chemistry, batteries]) => (
              <Card key={chemistry} className="shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getChemistryColor(chemistry)}>{chemistry}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Configuration</TableHead>
                          <TableHead className="font-semibold text-center">Fully Discharged</TableHead>
                          <TableHead className="font-semibold text-center">Advisable Discharge</TableHead>
                          <TableHead className="font-semibold text-center">Storage</TableHead>
                          <TableHead className="font-semibold text-center">Nominal</TableHead>
                          <TableHead className="font-semibold text-center">Full Charge</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batteries.map((battery, index) => {
                          const isUncommon = chemistry === 'NiMH' && parseInt(battery.cells.replace('S', '')) >= 3;
                          return (
                            <TableRow 
                              key={index} 
                              className={isUncommon ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'}
                              data-testid={`row-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {battery.cells === '1S' ? 'Single Cell' : battery.cells}
                                  {isUncommon && (
                                    <Badge variant="secondary" className="text-xs">Less Common</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span data-testid={`voltage-fully-discharged-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}>
                                  {battery.emptyVoltage}V
                                </span>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span data-testid={`voltage-advisable-discharge-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}>
                                  {getAdvisableDischargeVoltage(chemistry as Chemistry, battery.cells)}V
                                </span>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span data-testid={`voltage-storage-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}>
                                  {battery.storageVoltage}V
                                </span>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span data-testid={`voltage-nominal-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}>
                                  {battery.nominalVoltage}V
                                </span>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span data-testid={`voltage-full-charge-${chemistry.toLowerCase()}-${battery.cells.toLowerCase()}`}>
                                  {battery.fullVoltage}V
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
