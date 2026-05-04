
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2 } from 'lucide-react';
import type { Actor } from '@/lib/types';
import { useRouter } from 'next/navigation';

type ParsedActor = Omit<Actor, 'id' | 'physical_attributes' | 'image_url' | 'portfolio_url'> & {
    height: string;
    build: string;
    hair_color: string;
};

export function BulkImportActors() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedActor[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      parseCsv(selectedFile);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a valid CSV file.',
        variant: 'destructive',
      });
      setFile(null);
      setParsedData([]);
    }
  };

  const parseCsv = (csvFile: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ['name', 'age', 'height', 'build', 'hair_color', 'skills', 'emotional_traits'];
        
        if(!requiredHeaders.every(h => headers.includes(h))) {
            throw new Error('CSV is missing required headers: ' + requiredHeaders.join(', '));
        }

        const data = lines.slice(1).map((line, rowIndex) => {
          if (!line.trim()) return null; // Skip empty lines
          const values = line.split(',');
          const row: any = {};
          headers.forEach((header, index) => {
             const value = values[index]?.trim().replace(/"/g, '') || '';
             if (header === 'skills' || header === 'emotional_traits') {
                 row[header] = value.split('|').map(s => s.trim()).filter(Boolean);
             } else if (header === 'age') {
                 row[header] = parseInt(value, 10);
             } else {
                 row[header] = value;
             }
          });

          if (!row.name || isNaN(row.age)) {
              throw new Error(`Invalid data on row ${rowIndex + 2}. 'name' is required and 'age' must be a number.`);
          }

          return {
              name: row.name,
              age: row.age,
              gender: row.gender || 'any',
              height: row.height,
              build: row.build,
              hair_color: row.hair_color,
              skills: row.skills || [],
              emotional_traits: row.emotional_traits || [],
          } as ParsedActor;
        }).filter(Boolean) as ParsedActor[];

        setParsedData(data);
        toast({
          title: 'File Parsed',
          description: `${data.length} records ready for import.`,
        });
      } catch (error: any) {
        toast({
          title: 'Parsing Error',
          description: error.message || 'Could not parse the CSV file. Please check the format.',
          variant: 'destructive',
        });
        setParsedData([]);
        setFile(null);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
        toast({
            title: 'File Read Error',
            description: 'Could not read the selected file.',
            variant: 'destructive'
        });
        setIsParsing(false);
    }
    reader.readAsText(csvFile);
  };

  const handleDownloadSample = () => {
    const csvContent =
      'name,age,gender,height,build,hair_color,skills,emotional_traits\n' +
      '"Jane Doe",32,"female","5\'8\'\'","Slender","Brown","Singing|Dancing","Charismatic|Witty"\n' +
      '"Chris Smith",45,"male","6\'1\'\'","Athletic","Black","Stunts|Combat Training","Intense|Brooding"';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sample_actors.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast({
        title: 'No Data to Import',
        description: 'Please upload and parse a file first.',
        variant: 'destructive',
      });
      return;
    }
    setIsImporting(true);
    
    try {
        const response = await fetch('/api/actors/bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actors: parsedData }),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.error || 'Bulk import failed');
        }

        const result = await response.json();
        toast({
            title: 'Import Successful!',
            description: `Successfully imported ${result.insertedCount} actors.`,
        });

        setFile(null);
        setParsedData([]);
        router.refresh();
    } catch (error: any) {
        toast({
            title: 'Import Failed',
            description: error.message || 'An unexpected error occurred during import.',
            variant: 'destructive',
        });
    } finally {
        setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Actors</CardTitle>
          <CardDescription>Upload a CSV file to add multiple actors at once. The file must contain the required headers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
             <label htmlFor="csv-upload" className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg h-full text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold">{file ? file.name : 'Click to upload or drag and drop'}</p>
                    <p className="text-xs text-muted-foreground">CSV file up to 5MB</p>
                    <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                </div>
            </label>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button onClick={handleDownloadSample} variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button onClick={handleImport} disabled={parsedData.length === 0 || isImporting} className="w-full justify-start">
                {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Import {parsedData.length > 0 ? `(${parsedData.length})` : ''} Actors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {(isParsing || parsedData.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Import Preview</CardTitle>
            <CardDescription>Review the data before importing. Any errors will be highlighted.</CardDescription>
          </CardHeader>
          <CardContent>
            {isParsing ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="ml-2">Parsing CSV...</span>
                </div>
            ) : (
              <div className="rounded-lg border max-h-96 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Emotional Traits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((actor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{actor.name}</TableCell>
                        <TableCell>{actor.age}</TableCell>
                        <TableCell className="max-w-xs truncate">{actor.skills.join(', ')}</TableCell>
                        <TableCell className="max-w-xs truncate">{actor.emotional_traits.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
