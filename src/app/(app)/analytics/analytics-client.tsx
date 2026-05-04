
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Actor, Role } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, Line, LineChart, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Trophy, BarChart3, PieChartIcon, LineChartIcon, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

type AnalyticsClientProps = {
    actors: Actor[];
    roles: Role[];
}

export function AnalyticsClient({ actors, roles }: AnalyticsClientProps) {
    const [topActors, setTopActors] = useState<{ name: string; matches: number }[]>([]);

    const {
        ageBuckets,
        skillsData,
        genreData,
        soughtSkills,
    } = useMemo(() => {
        // 1. Age Distribution
        const ageBuckets = [
            { name: '0-20', count: 0 },
            { name: '21-30', count: 0 },
            { name: '31-40', count: 0 },
            { name: '41-50', count: 0 },
            { name: '51+', count: 0 },
        ];
        actors.forEach(actor => {
            if (actor.age <= 20) ageBuckets[0].count++;
            else if (actor.age <= 30) ageBuckets[1].count++;
            else if (actor.age <= 40) ageBuckets[2].count++;
            else if (actor.age <= 50) ageBuckets[3].count++;
            else ageBuckets[4].count++;
        });

        // 2. Skills Distribution
        const skillCounts: Record<string, number> = {};
        actors.forEach(actor => {
            actor.skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });
        const skillsData = Object.entries(skillCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 skills

        // 3. Roles by Genre
        const genreCounts: Record<string, number> = {};
        roles.forEach(role => {
            genreCounts[role.genre] = (genreCounts[role.genre] || 0) + 1;
        });
        const genreData = Object.entries(genreCounts).map(([name, count]) => ({
            name,
            count,
        }));

        // 6. Most Sought-after skills
        const soughtSkills = Object.entries(
            roles.reduce((acc, role) => {
                [...role.required_skills, ...role.emotional_traits].forEach(skill => {
                    acc[skill] = (acc[skill] || 0) + 1;
                });
                return acc;
            }, {} as Record<string, number>)
        ).sort((a,b) => b[1] - a[1]).slice(0, 5);

        return { ageBuckets, skillsData, genreData, soughtSkills };
    }, [actors, roles]);

    useEffect(() => {
        if (actors.length > 0) {
            // 5. Top Actors (Static) - now generated on client
            const clientTopActors = actors.slice(0,3).map(a => ({ name: a.name, matches: Math.floor(Math.random() * 15) + 5 })).sort((a,b) => b.matches - a.matches);
            setTopActors(clientTopActors);
        }
    }, [actors]);


    // 4. Matching Success (Static Data)
    const matchingData = [
        { month: 'Jan', rate: 75, newActors: 5 },
        { month: 'Feb', rate: 78, newActors: 8 },
        { month: 'Mar', rate: 85, newActors: 12 },
        { month: 'Apr', rate: 82, newActors: 7 },
        { month: 'May', rate: 90, newActors: 15 },
        { month: 'Jun', rate: 92, newActors: 18 },
    ];


    return (
        <div className="container mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">Analytics Overview</h1>
            <p className="text-muted-foreground">
            Insights into your talent database and casting activities.
            </p>
        </div>

         <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
             <Card>
                 <CardHeader className='pb-2'>
                    <CardDescription>Total Actors</CardDescription>
                    <CardTitle className="text-4xl">{actors.length}</CardTitle>
                 </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">+5 this week</div>
                 </CardContent>
             </Card>
              <Card>
                 <CardHeader className='pb-2'>
                    <CardDescription>Total Roles</CardDescription>
                    <CardTitle className="text-4xl">{roles.length}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="text-xs text-muted-foreground">+2 this week</div>
                 </CardContent>
             </Card>
              <Card>
                 <CardHeader className='pb-2'>
                    <CardDescription>Avg. Match Score</CardDescription>
                    <CardTitle className="text-4xl">82%</CardTitle>
                 </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">Based on recent activity</div>
                 </CardContent>
             </Card>
              <Card>
                 <CardHeader className='pb-2'>
                    <CardDescription>Most Matched Actor</CardDescription>
                    <CardTitle className="text-2xl truncate">{topActors[0]?.name || 'Loading...'}</CardTitle>
                 </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">{topActors.length > 0 ? `${topActors[0].matches} matches` : '...'}</div>
                 </CardContent>
             </Card>
         </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
            <CardHeader>
                <div className='flex items-center gap-2'>
                <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Database Growth</CardTitle>
                </div>
                <CardDescription>Monthly trend of successful matches and new actors added.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                <LineChart data={matchingData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis yAxisId="left" type="number" domain={[70, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                     <YAxis yAxisId="right" orientation="right" type="number" domain={[0, 20]} tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                    <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Line yAxisId="left" name="Match Rate" type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }}/>
                    <Line yAxisId="right" name="New Actors" type="monotone" dataKey="newActors" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--accent))' }}/>
                </LineChart>
                </ChartContainer>
            </CardContent>
            </Card>

            <Card className="lg:col-span-2">
            <CardHeader>
                <div className='flex items-center gap-2'>
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Roles by Genre</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={genreData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} label>
                        {genreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <div className='flex items-center gap-2'>
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Actor Age Distribution</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                <BarChart data={ageBuckets} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader>
                <div className='flex items-center gap-2'>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Top 10 Actor Skills</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                 <BarChart data={skillsData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={80}/>
                    <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}
