
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Actor } from '@/lib/types';
import type { AnalyzeFacialSimilarityOutput } from '@/ai/flows/analyze-facial-similarity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LookalikeResult = AnalyzeFacialSimilarityOutput & {
  childActor: Actor;
};

export default function ChildLookalikePage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<LookalikeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchActors() {
      try {
        const res = await fetch('/api/actors', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch actors');
        setActors(await res.json());
      } catch (e: any) {
        toast({
          title: 'Error fetching actors',
          description: e.message,
          variant: 'destructive',
        });
      }
    }
    fetchActors();
  }, [toast]);

  const { adultActors, allChildActors } = useMemo(() => {
    const adults = actors.filter(a => a.age >= 23).sort((a,b) => a.name.localeCompare(b.name));
    const children = actors.filter(a => a.age < 23);
    return { adultActors: adults, allChildActors: children };
  }, [actors]);

  const handleAnalyze = async () => {
    if (!selectedActor) {
      toast({ title: 'Please select an adult actor.', variant: 'destructive' });
      return;
    }

    const adultActor = selectedActor;
    
    const childActorsToAnalyze = allChildActors.filter(child => child.gender === adultActor.gender);

    if (childActorsToAnalyze.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Matches Found',
        description: `No child actors with the gender '${adultActor.gender}' were found to compare.`,
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults([]);
    setProgress(0);
    toast({
      title: 'Starting Analysis...',
      description: `Comparing ${adultActor.name} with ${childActorsToAnalyze.length} child actors. This may take a moment.`,
    });

    const successfulResults: LookalikeResult[] = [];
    const failedNames: string[] = [];
    let firstError: string | null = null;
    
    const BATCH_SIZE = 2;
    const DELAY_BETWEEN_BATCHES = 30000; // 30 seconds

    try {
      for (let i = 0; i < childActorsToAnalyze.length; i++) {
        const childActor = childActorsToAnalyze[i];
        try {
          const response = await fetch('/api/analyze-facial-similarity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actorAName: adultActor.name,
              actorAImageUrl: adultActor.image_url,
              actorBName: childActor.name,
              actorBImageUrl: childActor.image_url,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'The AI model may have safety concerns or image issues.' }));
            throw new Error(errorData.error || `Analysis failed for ${childActor.name}`);
          }
          
          const data = await response.json();
          const result = { ...data, childActor };
          
          setResults(prevResults => [...prevResults, result].sort((a,b) => b.similarityScore - a.similarityScore));
          successfulResults.push(result);

        } catch (e: any) {
          console.error(`Failed to analyze ${childActor.name}:`, e);
          failedNames.push(childActor.name);
          if (!firstError) {
            firstError = e.message;
          }
        }
        setProgress(((i + 1) / childActorsToAnalyze.length) * 100);

        // Pause between batches to avoid hitting API rate limits.
        if ((i + 1) % BATCH_SIZE === 0 && i < childActorsToAnalyze.length - 1) {
            toast({
                title: 'Pausing to respect API limits...',
                description: `Continuing in ${DELAY_BETWEEN_BATCHES / 1000} seconds.`
            });
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }
      
      if (failedNames.length > 0) {
        toast({
          title: 'Partial Analysis Complete',
          description: `Could not analyze ${failedNames.length} actors. First error: ${firstError}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Analysis Complete!',
          description: `Found ${successfulResults.length} potential lookalikes for ${adultActor.name}.`,
        });
      }

    } catch (e: any) {
      setError(e.message);
      toast({ title: 'An error occurred during analysis.', description: e.message, variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
    const getScoreColor = (scoreValue: number) => {
        if (scoreValue >= 80) return 'text-green-400';
        if (scoreValue >= 60) return 'text-yellow-400';
        if (scoreValue >= 40) return 'text-orange-400';
        return 'text-red-500';
    }

  if (!isClient) {
    return (
      <div className="container mx-auto space-y-8">
        <div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card>
          <CardHeader>
             <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full sm:w-[300px]" />
            <Skeleton className="h-10 w-44" />
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Child Actor Lookalike Finder</h1>
        <p className="text-muted-foreground">
          Use AI to see which child actor could plausibly play a younger version of an adult actor.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select an Actor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Select 
            onValueChange={(actorId) => {
                const actor = actors.find(a => a.id === parseInt(actorId));
                setSelectedActor(actor || null);
            }} 
            value={selectedActor ? String(selectedActor.id) : ''} 
            disabled={isAnalyzing}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder={adultActors.length > 0 ? "Select an adult actor..." : "Loading actors..."} />
            </SelectTrigger>
            <SelectContent>
              {adultActors.map(actor => (
                <SelectItem key={actor.id} value={String(actor.id)}>
                  {actor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedActor} className="w-full sm:w-auto">
            {isAnalyzing ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
            {isAnalyzing ? 'Analyzing...' : 'Find Lookalikes'}
          </Button>
        </CardContent>
         {isAnalyzing && (
            <CardContent>
                <Progress value={progress} className="w-full" />
                <p className='text-center text-sm text-muted-foreground mt-2'>Analyzing... {Math.round(progress)}% complete</p>
            </CardContent>
        )}
      </Card>

      {isAnalyzing && results.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-around items-start gap-4">
                            <div className="space-y-2"><Skeleton className="h-24 w-24 rounded-lg" /><Skeleton className="h-4 w-20 mx-auto" /></div>
                            <div className="space-y-2"><Skeleton className="h-24 w-24 rounded-lg" /><Skeleton className="h-4 w-20 mx-auto" /></div>
                        </div>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {results.length > 0 && selectedActor && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(({ childActor, similarityScore, analysis }) => (
            <Card key={childActor.id} className="h-full flex flex-col">
              <CardHeader>
                  <div className='flex justify-between items-start'>
                      <CardTitle>Comparison Result</CardTitle>
                      <div className='text-right'>
                          <p className={cn("text-3xl font-bold", getScoreColor(similarityScore))}>
                              {similarityScore}%
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">Similarity</p>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                  <div className="flex justify-around items-start gap-4 text-center">
                      <div className="flex flex-col items-center gap-1 w-[100px]">
                           <Image
                              src={selectedActor.image_url}
                              alt={selectedActor.name}
                              width={96}
                              height={96}
                              className="rounded-lg object-cover aspect-square border"
                              data-ai-hint="person headshot"
                          />
                          <p className="font-semibold text-sm mt-1 leading-tight">{selectedActor.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedActor.age} yrs</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 w-[100px]">
                           <Image
                              src={childActor.image_url}
                              alt={childActor.name}
                              width={96}
                              height={96}
                              className="rounded-lg object-cover aspect-square border"
                              data-ai-hint="person headshot"
                          />
                          <p className="font-semibold text-sm mt-1 leading-tight">{childActor.name}</p>
                          <p className="text-xs text-muted-foreground">{childActor.age} yrs</p>
                      </div>
                  </div>
                  <div className='space-y-2 pt-2'>
                      <Progress value={similarityScore} className="h-2" />
                      <p className="text-sm text-muted-foreground italic text-center pt-2">"{analysis}"</p>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
       
       {!isAnalyzing && results.length === 0 && (
         <Card className="flex items-center justify-center h-48">
            {error ? (
                 <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ): (
                <p className="text-muted-foreground">Results will be shown here after analysis.</p>
            )}
        </Card>
       )}
    </div>
  );
}
