
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import type { Role } from '@/lib/types';

const roleFormSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  characterName: z.string().min(1, 'Character name is required'),
  genre: z.string().min(1, 'Genre is required'),
  gender: z.enum(['male', 'female', 'any'], { required_error: 'Gender is required.' }),
  ageMin: z.coerce.number().min(0),
  ageMax: z.coerce.number().min(0),
  characterOutline: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requiredSkills: z.array(z.object({ value: z.string().min(1) })),
  emotionalTraits: z.array(z.object({ value: z.string().min(1) })),
});

type RoleFormProps = {
    initialData?: Role | null;
    onSuccess?: () => void;
}

export function RoleForm({ initialData, onSuccess }: RoleFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      projectName: '',
      characterName: '',
      genre: '',
      gender: 'any',
      ageMin: 18,
      ageMax: 35,
      description: '',
      requiredSkills: [{ value: '' }],
      emotionalTraits: [{ value: '' }],
    },
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            projectName: initialData.project_name,
            characterName: initialData.character_name,
            genre: initialData.genre,
            gender: initialData.gender,
            ageMin: initialData.age_range_min,
            ageMax: initialData.age_range_max,
            description: initialData.description,
            requiredSkills: initialData.required_skills.map(s => ({ value: s })),
            emotionalTraits: initialData.emotional_traits.map(t => ({ value: t })),
        });
    }
  }, [initialData, form]);
  
  const { fields: skills, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "requiredSkills",
  });

  const { fields: traits, append: appendTrait, remove: removeTrait } = useFieldArray({
    control: form.control,
    name: "emotionalTraits",
  });

  const handleGenerateDescription = async () => {
    const outline = form.getValues('characterOutline');
    if (!outline) {
      toast({
        title: 'Outline Required',
        description: 'Please provide a character outline to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-role-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterOutline: outline }),
      });
      if (!response.ok) throw new Error('Failed to generate description');
      const data = await response.json();
      form.setValue('description', data.roleDescription, { shouldValidate: true });
      toast({
        title: 'Description Generated!',
        description: 'The role description has been populated by AI.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate role description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof roleFormSchema>) {
    setIsSubmitting(true);
    const url = isEditMode ? `/api/roles/${initialData?.id}` : '/api/roles';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} role`);
        }

        toast({
            title: `Role ${isEditMode ? 'Updated' : 'Created'}`,
            description: `The role for ${values.characterName} has been ${isEditMode ? 'updated' : 'created'}.`,
        });

        if (onSuccess) {
            onSuccess();
        } else {
             router.push('/actors?tab=roles');
             router.refresh();
        }
    } catch (error: any) {
        toast({
            title: `Failed to ${isEditMode ? 'Update' : 'Create'} Role`,
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className={isEditMode ? 'border-none shadow-none' : ''}>
              {!isEditMode && 
                <CardHeader>
                    <CardTitle className="font-headline">Core Details</CardTitle>
                </CardHeader>
              }
              <CardContent className={isEditMode ? 'p-0 pt-4' : ''}>
                <div className='space-y-4'>
                    <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="projectName" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Cybernetic Dawn" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="characterName" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Character Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Kaelen" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    </div>
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="any" /></FormControl>
                                <FormLabel className="font-normal">Any</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="male" /></FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="female" /></FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="genre" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl><Input placeholder="e.g., Sci-Fi Action" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="ageMin" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Min. Age</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="ageMax" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Max. Age</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isEditMode ? 'border-none shadow-none' : ''}>
              {!isEditMode &&
                <CardHeader>
                    <CardTitle className="font-headline">Role Description</CardTitle>
                </CardHeader>
              }
              <CardContent className={`${isEditMode ? 'p-0' : ''} space-y-4`}>
                <FormField control={form.control} name="characterOutline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Outline (for AI)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief outline to generate a detailed description, e.g., 'Charismatic leader of a rebellion in a dystopian future...'" {...field} />
                    </FormControl>
                    <FormDescription>Use the button below to generate a full description with AI.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="button" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Generate with AI
                </Button>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl><Textarea rows={6} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className={isEditMode ? 'border-none shadow-none' : ''}>
               {!isEditMode &&
                <CardHeader>
                    <CardTitle className="font-headline">Required Skills</CardTitle>
                </CardHeader>
               }
              <CardContent className={`${isEditMode ? 'p-0' : ''} space-y-4`}>
                 {isEditMode && <FormLabel>Required Skills</FormLabel>}
                {skills.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`requiredSkills.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2">
                           <FormControl><Input placeholder="e.g., Fencing" {...field} /></FormControl>
                           <Button variant="ghost" size="icon" type="button" onClick={() => removeSkill(index)}><Trash className="h-4 w-4" /></Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ value: '' })}>
                  Add Skill
                </Button>
              </CardContent>
            </Card>
             <Card className={isEditMode ? 'border-none shadow-none' : ''}>
              {!isEditMode && 
                <CardHeader>
                    <CardTitle className="font-headline">Emotional Traits</CardTitle>
                </CardHeader>
              }
              <CardContent className={`${isEditMode ? 'p-0' : ''} space-y-4`}>
                 {isEditMode && <FormLabel>Emotional Traits</FormLabel>}
                {traits.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`emotionalTraits.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2">
                          <FormControl><Input placeholder="e.g., Brave" {...field} /></FormControl>
                           <Button variant="ghost" size="icon" type="button" onClick={() => removeTrait(index)}><Trash className="h-4 w-4" /></Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendTrait({ value: '' })}>
                  Add Trait
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Save Changes' : 'Create Role'}
        </Button>
      </form>
    </Form>
  );
}
