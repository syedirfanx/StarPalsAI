
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Save, TestTube, Download, Trash, RefreshCcw, Upload, Power, PowerOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { toast } = useToast();
  const [ageWeight, setAgeWeight] = useState(30);
  const [physicalWeight, setPhysicalWeight] = useState(40);
  const [skillsWeight, setSkillsWeight] = useState(30);

  const [apiKey, setApiKey] = useState('');
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  const [actorCount, setActorCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const [actorsRes, rolesRes] = await Promise.all([
          fetch('/api/actors', { cache: 'no-store' }),
          fetch('/api/roles', { cache: 'no-store' })
        ]);

        if (!actorsRes.ok) throw new Error('Failed to fetch actors');
        const actorsData = await actorsRes.json();
        setActorCount(actorsData.length);

        if (!rolesRes.ok) throw new Error('Failed to fetch roles');
        const rolesData = await rolesRes.json();
        setRoleCount(rolesData.length);

      } catch (error) {
        console.error("Failed to load system info", error);
        toast({
          title: "Error",
          description: "Could not load system information.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, [toast]);


  const handleSaveChanges = () => {
    // In a real app, you'd want to ensure these sum to 100
    if (ageWeight + physicalWeight + skillsWeight !== 100) {
        toast({
            title: 'Invalid Weights',
            description: `The weights must sum to 100. Current sum: ${ageWeight + physicalWeight + skillsWeight}%`,
            variant: "destructive"
        });
        return;
    }
    toast({
      title: 'Settings Saved (Simulated)',
      description: `Weights updated to Age: ${ageWeight}%, Physical: ${physicalWeight}%, Skills: ${skillsWeight}%`,
    });
  };

  const handleTestData = () => {
    setApiStatus('unknown');
    toast({ title: 'Connecting...', description: 'Pinging Gemini API...' });
    setTimeout(() => {
        // This would be a real API call in a real app
        if (apiKey.startsWith('sk-')) {
             setApiStatus('connected');
             toast({ title: 'Connection Successful!', description: 'Gemini API is responding correctly.' });
        } else {
            setApiStatus('error');
            toast({ title: 'Connection Failed', description: 'Invalid API Key provided.', variant: 'destructive' });
        }
    }, 1500)
  }
  
  const handleDataAction = (action: string) => {
    toast({
      title: `${action} (Simulated)`,
      description: `The ${action.toLowerCase()} action was completed successfully. In a real app, this would perform a database operation.`,
    });
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage application configuration and data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Matching Algorithm Weights</CardTitle>
              <CardDescription>
                Adjust the importance of different factors in the compatibility score. The sum must be 100%.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Age Match Weight</Label>
                    <span className="text-primary font-semibold">{ageWeight}%</span>
                  </div>
                  <Slider
                    value={[ageWeight]}
                    max={100}
                    step={5}
                    onValueChange={(value) => setAgeWeight(value[0])}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Physical Match Weight</Label>
                    <span className="text-primary font-semibold">{physicalWeight}%</span>
                  </div>
                  <Slider
                    value={[physicalWeight]}
                    max={100}
                    step={5}
                    onValueChange={(value) => setPhysicalWeight(value[0])}
                  />
                </div>
                <div>
                   <div className="flex justify-between mb-2">
                    <Label>Skills Match Weight</Label>
                    <span className="text-primary font-semibold">{skillsWeight}%</span>
                  </div>
                  <Slider
                    value={[skillsWeight]}
                    max={100}
                    step={5}
                    onValueChange={(value) => setSkillsWeight(value[0])}
                  />
                </div>
              </div>
               <div className='flex gap-2'>
                    <Button onClick={handleSaveChanges}><Save className="mr-2"/> Save Changes</Button>
                    <Button variant="outline" onClick={() => { setAgeWeight(30); setPhysicalWeight(40); setSkillsWeight(30);}}><RefreshCcw className="mr-2"/> Reset to Defaults</Button>
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage credentials for integrated services like Google Gemini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className='flex justify-between items-center'>
                         <Label htmlFor="gemini-key">Gemini API Key</Label>
                         <div className='flex items-center gap-2 text-sm'>
                            {apiStatus === 'connected' && <><Power className="text-green-500"/> Connected</>}
                            {apiStatus === 'error' && <><PowerOff className="text-destructive"/> Disconnected</>}
                         </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Input id="gemini-key" type="password" placeholder="••••••••••••••••••••••" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                        <Button variant="outline" onClick={handleTestData}><TestTube className="mr-2"/> Test</Button>
                    </div>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Be careful with these actions as they can lead to data loss.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => handleDataAction('Export All Data')}><Download className="mr-2"/> Export Data (JSON)</Button>
                     <Button variant="outline" onClick={() => handleDataAction('Import Data')}><Upload className="mr-2"/> Import Data (JSON)</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash className="mr-2"/> Clear All Data</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will completely wipe all actor and role data and reset the database to its initial state. This is irreversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDataAction('Reset Database')}>I understand, reset the database</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
               </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">App Version</span>
                        <span className="font-mono text-sm">1.0.0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Actors</span>
                        {loading ? <Skeleton className="h-6 w-10" /> : <span className="font-bold text-lg">{actorCount}</span>}
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Roles</span>
                        {loading ? <Skeleton className="h-6 w-10" /> : <span className="font-bold text-lg">{roleCount}</span>}
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Database Size</span>
                        <span className="font-mono text-sm">~ 1.2 MB</span>
                    </div>
                     <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">API Calls (24h)</span>
                        <span className="font-mono text-sm">1,204</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Backup</span>
                        <span className="font-mono text-sm">2024-07-29</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
