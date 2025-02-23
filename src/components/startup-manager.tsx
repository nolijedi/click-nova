import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { executeCommand } from '@/api/system';
import { 
  Play, 
  Trash2, 
  Search, 
  RotateCcw, 
  Save,
  AlertCircle
} from 'lucide-react';

interface StartupItem {
  name: string;
  location: string;
  type: string;
  enabled: boolean;
}

export function StartupManager() {
  const [startupItems, setStartupItems] = useState<StartupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStartupItems = async () => {
    try {
      setLoading(true);
      // Get startup items from registry
      const command = `Get-CimInstance Win32_StartupCommand | Select-Object Name, Location, Command | ConvertTo-Json`;
      const result = await executeCommand(command);
      const items = JSON.parse(result);
      
      setStartupItems(items.map((item: any) => ({
        name: item.Name,
        location: item.Command,
        type: item.Location.includes('HKLM') ? 'HKLM\\Run' : 'HKCU\\Run',
        enabled: true
      })));
      setError(null);
    } catch (err) {
      setError('Failed to fetch startup items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartupItems();
  }, []);

  const toggleStartupItem = async (index: number) => {
    const item = startupItems[index];
    const newItems = [...startupItems];
    newItems[index] = { ...item, enabled: !item.enabled };
    setStartupItems(newItems);
  };

  const deleteStartupItem = async (index: number) => {
    try {
      const item = startupItems[index];
      // Remove from registry
      const command = `Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "${item.name}"`;
      await executeCommand(command);
      
      const newItems = startupItems.filter((_, i) => i !== index);
      setStartupItems(newItems);
    } catch (err) {
      setError('Failed to delete startup item');
      console.error(err);
    }
  };

  const findInRegistry = async (index: number) => {
    const item = startupItems[index];
    // Open registry editor at location
    const command = `regedit /m "${item.type}\\${item.name}"`;
    await executeCommand(command);
  };

  if (error) {
    return (
      <Card className="p-6 bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/10">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/10">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Startup Manager
          </h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => fetchStartupItems()}
              variant="outline"
              className="border-purple-500/20 hover:bg-purple-500/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => {}} // Save changes
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {startupItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 hover:bg-purple-900/30 transition-colors"
            >
              <Checkbox
                checked={item.enabled}
                onCheckedChange={() => toggleStartupItem(index)}
                className="border-purple-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-white/90">{item.name}</span>
                </div>
                <div className="text-sm text-white/60 truncate mt-1">
                  {item.location}
                </div>
                <div className="text-xs text-purple-400/80 mt-1">
                  {item.type}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => findInRegistry(index)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/20 hover:bg-purple-500/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => deleteStartupItem(index)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && startupItems.length === 0 && (
            <div className="text-center py-8 text-white/60">
              No startup items found
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
