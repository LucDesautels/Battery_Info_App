import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Chart() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">Battery Voltage Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">Chart view coming soon</p>
              <p className="text-sm">This will display a comprehensive chart of all battery voltages</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
