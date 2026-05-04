
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getIconForTerm } from '@/components/icons';
import type { AnalyzeScriptOutput } from '@/ai/flows/analyze-script';
import { calculateCompatibilityScore } from '@/lib/matching';
import { ActorCard } from '@/components/actor-card';
import type { Actor, Role, CompatibilityScore } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

type ScoredActor = {
  actor: Actor;
  score: CompatibilityScore;
};

export default function ScriptAnalysisPage() {
  const [scriptText, setScriptText] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptOutput | null>(null);
  const [topMatches, setTopMatches] = useState<ScoredActor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loadingActors, setLoadingActors] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchActors() {
      try {
        const res = await fetch('/api/actors', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch actors for matching.');
        const data = await res.json();
        setActors(data);
      } catch (e: any) {
        toast({
          title: 'Could not load actors',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingActors(false);
      }
    }
    fetchActors();
  }, [toast]);

  const handleAnalyze = async (findMatches: boolean) => {
    if (!scriptText || !characterName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a script excerpt and a character name.',
        variant: 'destructive',
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTopMatches([]);
    setError(null);
    try {
      const response = await fetch('/api/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script_text: scriptText, character_name: characterName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze script');
      }
      const data: AnalyzeScriptOutput = await response.json();
      setAnalysisResult(data);
      toast({
        title: 'Analysis Complete!',
        description: `Extracted details for ${data.character_name}.`,
      });
      
      if(findMatches) {
        if (loadingActors) {
            toast({ title: 'Please wait', description: 'Actor database is still loading.' });
            return;
        }
         toast({
            title: 'Finding Matches...',
            description: `Searching for the best actors for the role.`,
        });
        const tempRole: Role = {
            id: 0,
            project_name: projectName || 'Analyzed Script',
            character_name: data.character_name,
            age_range_min: data.extracted_data.age_range_min,
            age_range_max: data.extracted_data.age_range_max,
            gender: data.extracted_data.gender,
            physical_requirements: {
                build: data.extracted_data.physical_requirements.build,
                hair_color: data.extracted_data.physical_requirements.hair_color === 'other' ? undefined : data.extracted_data.physical_requirements.hair_color,
            },
            required_skills: data.extracted_data.required_skills,
            emotional_traits: data.extracted_data.emotional_traits,
            genre: data.extracted_data.genre === 'other' ? '' : data.extracted_data.genre,
            description: '',
            created_at: new Date().toISOString(),
        };
        
        let actorsToScore = actors;
        if (data.extracted_data.gender && data.extracted_data.gender !== 'any') {
          actorsToScore = actors.filter(actor => actor.gender === data.extracted_data.gender);
        }

        const scoredActors = actorsToScore
            .map((actor) => ({
            actor,
            score: calculateCompatibilityScore(actor, tempRole),
            }))
            .sort((a, b) => b.score.total - a.score.total);
        
        setTopMatches(scoredActors.slice(0, 5));
      }

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      toast({
        title: 'Analysis Failed',
        description: e.message || 'Could not analyze the script. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const allTraits = analysisResult ? [...analysisResult.extracted_data.required_skills, ...analysisResult.extracted_data.emotional_traits] : [];


  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Script Analysis</h1>
        <p className="text-muted-foreground">Paste a script excerpt and enter a character's name to extract their attributes using AI.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Script Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='grid sm:grid-cols-2 gap-4'>
                 <div>
                    <label htmlFor="project-name" className="text-sm font-medium">Project Name</label>
                    <Input
                        id="project-name"
                        placeholder="e.g., Cybernetic Dawn"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                <label htmlFor="character-name" className="text-sm font-medium">Character Name</label>
                <Input
                    id="character-name"
                    placeholder="e.g., Kaelen"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="mt-1"
                />
                </div>
            </div>
            <div>
              <label htmlFor="script-text" className="text-sm font-medium">Script Excerpt</label>
              <Textarea
                id="script-text"
                placeholder="Paste the script text here..."
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={15}
                className="mt-1"
              />
            </div>
            <div className="flex gap-4">
                <Button onClick={() => handleAnalyze(false)} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Analyze Only
                </Button>
                <Button onClick={() => handleAnalyze(true)} disabled={isAnalyzing || loadingActors} className="w-full" variant="secondary">
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Analyze & Find Matches
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Analysis Results</CardTitle>
            <CardDescription>The extracted character profile will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Analyzing...</p>
              </div>
            )}
            {error && !isAnalyzing && (
              <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                      <span className="text-sm font-bold text-primary">{analysisResult.confidence_score}%</span>
                  </div>
                  <Progress value={analysisResult.confidence_score} className="h-2"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Character:</span> {analysisResult.character_name}</div>
                  <div><span className="font-semibold">Genre:</span> <Badge variant="secondary">{analysisResult.extracted_data.genre}</Badge></div>
                  <div><span className="font-semibold">Age Range:</span> {analysisResult.extracted_data.age_range_min}-{analysisResult.extracted_data.age_range_max}</div>
                  {analysisResult.extracted_data.gender && <div><span className="font-semibold">Gender:</span> <Badge variant="secondary">{analysisResult.extracted_data.gender}</Badge></div>}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Physical Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analysisResult.extracted_data.physical_requirements).map(([key, value]) => {
                      if (Array.isArray(value) && value.length === 0) return null;
                      if (!value) return null;
                      const displayValue = Array.isArray(value) ? value.join(', ') : value;
                      return <Badge key={key} variant="outline">{`${key.replace(/_/g, ' ')}: ${displayValue}`}</Badge>
                    })}
                  </div>
                </div>
                
                 <div>
                  <h4 className="font-semibold mb-2">Skills & Emotional Traits</h4>
                  <div className="flex flex-wrap gap-2">
                     {allTraits.map((trait) => (
                        <Badge key={trait} variant="outline" className="gap-1.5">
                          {getIconForTerm(trait)}
                          {trait}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {!analysisResult && !isAnalyzing && !error && (
               <div className="text-center text-muted-foreground p-8">
                 <p>Results will be displayed here once the analysis is complete.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {topMatches.length > 0 && !isAnalyzing && (
        <>
            <Separator />
            <div>
                <h2 className="text-3xl font-headline font-bold my-6">Top Actor Matches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topMatches.map(({ actor, score }) => (
                    <ActorCard key={actor.id} actor={actor} score={score} />
                ))}
                </div>
            </div>
        </>
      )}

    </div>
  );
}
