
'use client';

import { Actor, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Eye, RefreshCw, Edit, Trash, Download, Filter, X } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { BulkImportActors } from '@/components/bulk-import-actors';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useCallback, useEffect } from 'react';
import { ActorForm } from '@/components/actor-form';
import { RoleForm } from '@/components/role-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function TalentTabs({ actors, roles }: { actors: Actor[]; roles: Role[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  }

  const clearFilters = (prefix: 'r' | '') => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key] of Array.from(params.entries())) {
        if (prefix === 'r' && key.startsWith('r')) {
            params.delete(key);
        } else if (prefix === '' && !key.startsWith('r') && key !== 'tab') {
            params.delete(key);
        }
    }
    router.push(`${pathname}?${params.toString()}`);
  }


  const handleRefresh = () => {
    toast({
      title: 'Refreshing Data...',
      description: 'Fetching the latest actors and roles from the database.',
    });
    router.refresh();
  };

  const handleDelete = async (type: 'actor' | 'role', id: number, name: string) => {
    const url = type === 'actor' ? `/api/actors/${id}` : `/api/roles/${id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete ${type}`);
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`,
        description: `${name} has been removed.`,
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Deletion failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!isClient) {
    return (
        <div className="container mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96 mt-2" />
                </div>
                <Skeleton className="h-10 w-64" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                <div className="flex gap-2 w-full">
                    <Skeleton className="h-10 w-full max-w-xs" />
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="rounded-lg border">
                <Skeleton className="h-[400px] w-full" />
            </div>
      </div>
    )
  }
  
  const defaultTab = searchParams.get('tab') || "actors";

  return (
    <div className="container mx-auto">
      <Dialog open={!!editingActor} onOpenChange={(open) => !open && setEditingActor(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Actor: {editingActor?.name}</DialogTitle>
            </DialogHeader>
            <ActorForm 
                initialData={editingActor} 
                onSuccess={() => {
                    setEditingActor(null);
                    router.refresh();
                }}
            />
          </DialogContent>
      </Dialog>
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Role: {editingRole?.character_name}</DialogTitle>
            </DialogHeader>
            <RoleForm 
                initialData={editingRole} 
                onSuccess={() => {
                    setEditingRole(null);
                    router.refresh();
                }}
            />
          </DialogContent>
      </Dialog>

      <Tabs defaultValue={defaultTab} onValueChange={(tab) => router.push(`${pathname}?tab=${tab}`)} className="space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Talent Management</h1>
                <p className="text-muted-foreground">Manage your database of actors and roles.</p>
            </div>
          <TabsList>
            <TabsTrigger value="actors">Actors ({actors.length})</TabsTrigger>
            <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
            <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="actors">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <div className='flex gap-2 w-full'>
              <Input placeholder="Search actors by name..." defaultValue={searchParams.get('q') || ''} onChange={(e) => handleFilterChange('q', e.target.value)} className="max-w-xs" />
               <Select onValueChange={(val) => handleFilterChange('build', val)} value={searchParams.get('build') || ''}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by build" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
               <Select onValueChange={(val) => handleFilterChange('sort', val)} value={searchParams.get('sort') || ''}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="-name">Name (Z-A)</SelectItem>
                    <SelectItem value="age">Age (Youngest)</SelectItem>
                    <SelectItem value="-age">Age (Oldest)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={() => clearFilters('')}><X className="mr-2 h-4 w-4"/>Clear</Button>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end">
                <Button variant="outline" asChild><a href="/api/export/actors" download="actors.csv"><Download className="mr-2 h-4 w-4" />Export CSV</a></Button>
                <Button asChild>
                <Link href="/actors/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Actor
                </Link>
                </Button>
            </div>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actors.length > 0 ? actors.map((actor) => (
                  <TableRow key={actor.id}>
                    <TableCell>
                      <Image
                        src={actor.image_url}
                        alt={actor.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        data-ai-hint="person headshot"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{actor.name}</TableCell>
                    <TableCell>{actor.age}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {actor.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild><Link href={`/actors/${actor.id}`}>View Details</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingActor(actor)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {actor.name}.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete('actor', actor.id, actor.name)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No actors found matching your criteria.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="roles">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
             <div className='flex gap-2 w-full'>
                <Input placeholder="Search roles by name..." defaultValue={searchParams.get('rq') || ''} onChange={(e) => handleFilterChange('rq', e.target.value)} className="max-w-xs" />
                <Select onValueChange={(val) => handleFilterChange('r_genre', val)} value={searchParams.get('r_genre') || ''}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => clearFilters('r')}><X className="mr-2 h-4 w-4"/>Clear</Button>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end">
                <Button variant="outline" asChild><a href="/api/export/roles" download="roles.csv"><Download className="mr-2 h-4 w-4" />Export CSV</a></Button>
                <Button asChild>
                <Link href="/roles/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Role
                </Link>
                </Button>
            </div>
          </div>
           <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Character</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length > 0 ? roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.character_name}</TableCell>
                    <TableCell>{role.project_name}</TableCell>
                    <TableCell>{`${role.age_range_min}-${role.age_range_max}`}</TableCell>
                    <TableCell><Badge variant="outline">{role.genre}</Badge></TableCell>
                    <TableCell className='text-right'>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild><Link href={`/roles/${role.id}`}>Find Matches</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingRole(role)}>Edit</DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the role of {role.character_name}.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete('role', role.id, role.character_name)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No roles found matching your criteria.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="bulk-import">
          <BulkImportActors />
        </TabsContent>
      </Tabs>
    </div>
  );
}
