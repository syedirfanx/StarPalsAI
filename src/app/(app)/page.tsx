
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Users,
  Film,
  CheckCircle,
  PlusCircle,
  FileText,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { actors, roles } from '@/lib/in-memory-db';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  // Access data directly in Server Components instead of fetching via localhost
  const allActors = [...actors];
  const allRoles = [...roles];

  const recentActivity = [
    ...allActors.map(actor => ({ ...actor, type: 'Actor', entityName: actor.name })),
    ...allRoles.map(role => ({ ...role, type: 'Role', entityName: role.character_name }))
  ]
  .filter(item => item.created_at)
  .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
  .slice(0, 5);

  const totalMatches = Math.round(allActors.length * 2.3) + 15;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
          StarPals AI
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
          AI-Powered Talent Casting Platform
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/script-analysis">
              <FileText className="mr-2" />
              Analyze Script
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/actors">
              <Search className="mr-2" />
              Find Matches
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Actors</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allActors.length}</div>
            <p className="text-xs text-muted-foreground">
              Profiles in the database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Film className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allRoles.length}</div>
            <p className="text-xs text-muted-foreground">
              Casting opportunities available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Matches
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              Successful matches made (simulated)
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest additions to the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.length > 0 ? recentActivity.map((item) => (
                    <TableRow key={`${item.type}-${item.id}`}>
                      <TableCell className="font-medium">{item.entityName}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === 'Actor' ? 'outline' : 'secondary'}>{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at!), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">No recent activity. Add some actors and roles!</TableCell>
                     </TableRow>
                   )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Start your next casting task.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button asChild size="lg" className="w-full justify-start">
                  <Link href="/actors/new">
                    <Users className="mr-4" />
                    Add New Actor
                  </Link>
                </Button>
               <Button asChild size="lg" className="w-full justify-start">
                  <Link href="/roles/new">
                    <PlusCircle className="mr-4" />
                    Create Role
                  </Link>
                </Button>
                <Button asChild size="lg" className="w-full justify-start">
                  <Link href="/script-analysis">
                    <FileText className="mr-4" />
                    Analyze Script
                  </Link>
                </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
