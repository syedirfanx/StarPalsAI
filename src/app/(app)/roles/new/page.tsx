import { RoleForm } from '@/components/role-form';

export default function NewRolePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold">Define a New Role</h1>
        <p className="text-muted-foreground">Fill in the details below. You can use AI to help generate the role description.</p>
      </div>
      <RoleForm />
    </div>
  );
}
