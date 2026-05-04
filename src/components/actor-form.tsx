
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Actor } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const actorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().min(1, 'Age is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required.' }),
  height: z.string().min(1, "Height is required"),
  build: z.enum(['athletic', 'slim', 'average', 'heavy']),
  hairColor: z.enum(['blonde', 'brown', 'black', 'red', 'gray', 'other']),
  eyeColor: z.string().min(1, "Eye color is required"),
  skills: z.array(z.object({ value: z.string().min(1, "Skill cannot be empty") })),
  emotionalTraits: z.array(z.object({ value: z.string().min(1, "Trait cannot be empty") })),
  portfolioUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type ActorFormProps = {
    initialData?: Actor | null;
    onSuccess?: () => void;
}

export function ActorForm({ initialData, onSuccess }: ActorFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const { user } = useUser();

  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof actorFormSchema>>({
    resolver: zodResolver(actorFormSchema),
    defaultValues: {
      name: '',
      age: 30,
      height: '',
      eyeColor: '',
      skills: [{ value: '' }],
      emotionalTraits: [{ value: '' }],
      portfolioUrl: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            name: initialData.name,
            age: initialData.age,
            gender: initialData.gender,
            height: initialData.physicalAttributes.height,
            build: initialData.physicalAttributes.build as any,
            hairColor: initialData.physicalAttributes.hairColor as any,
            eyeColor: initialData.physicalAttributes.eyeColor,
            skills: initialData.skills.map(s => ({ value: s })),
            emotionalTraits: initialData.emotionalTraits.map(t => ({ value: t })),
            portfolioUrl: initialData.portfolioUrl,
            imageUrl: initialData.imageUrl,
        });
    }
  }, [initialData, form]);
  
  const { fields: skills, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const { fields: traits, append: appendTrait, remove: removeTrait } = useFieldArray({
    control: form.control,
    name: "emotionalTraits",
  });

  async function onSubmit(values: z.infer<typeof actorFormSchema>) {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please sign in to save actor profiles.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
        const actorData = {
          ownerId: user.uid,
          name: values.name,
          age: values.age,
          gender: values.gender,
          physicalAttributes: {
            height: values.height,
            build: values.build,
            hairColor: values.hairColor,
            eyeColor: values.eyeColor,
          },
          skills: values.skills.map(s => s.value),
          emotionalTraits: values.emotionalTraits.map(t => t.value),
          portfolioUrl: values.portfolioUrl,
          imageUrl: values.imageUrl || `https://picsum.photos/seed/${Date.now()}/200/200`,
          createdAt: initialData?.createdAt || new Date().toISOString(),
        };

        if (isEditMode && initialData) {
          const docRef = doc(db, 'actors', initialData.id);
          setDocumentNonBlocking(docRef, actorData, { merge: true });
        } else {
          const colRef = collection(db, 'actors');
          addDocumentNonBlocking(colRef, actorData);
        }
        
        toast({
            title: `Actor ${isEditMode ? 'Updated' : 'Added'}`,
            description: `${values.name} has been saved successfully.`,
        });
        
        if (onSuccess) {
            onSuccess();
        } else {
             router.push('/actors');
        }

    } catch (error: any) {
        toast({
            title: `Failed to ${isEditMode ? 'Update' : 'Add'} Actor`,
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
        <Card className="border-none shadow-none">
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 32" {...field} /></FormControl>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <FormField control={form.control} name="height" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Height</FormLabel>
                         <FormControl><Input placeholder="e.g., 5'11''" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="build" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Build</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select build" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="athletic">Athletic</SelectItem>
                                <SelectItem value="slim">Slim</SelectItem>
                                <SelectItem value="average">Average</SelectItem>
                                <SelectItem value="heavy">Heavy</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="hairColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hair Color</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select hair color" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="blonde">Blonde</SelectItem>
                                <SelectItem value="brown">Brown</SelectItem>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="gray">Gray</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="eyeColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Eye Color</FormLabel>
                        <FormControl><Input placeholder="e.g., Blue" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <FormLabel>Skills</FormLabel>
                    <div className="space-y-2 pt-2">
                        {skills.map((field, index) => (
                          <FormField
                            control={form.control}
                            key={field.id}
                            name={`skills.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex gap-2">
                                   <FormControl><Input placeholder="e.g., Martial Arts" {...field} /></FormControl>
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
                    </div>
                 </div>
                 <div>
                    <FormLabel>Emotional Traits</FormLabel>
                     <div className="space-y-2 pt-2">
                        {traits.map((field, index) => (
                          <FormField
                            control={form.control}
                            key={field.id}
                            name={`emotionalTraits.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex gap-2">
                                  <FormControl><Input placeholder="e.g., Confident" {...field} /></FormControl>
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
                    </div>
                 </div>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Portfolio URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://example.com/portfolio" {...field} /></FormControl>
                        <FormDescription>Link to the actor's professional portfolio or reel.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="space-y-4">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input placeholder="https://example.com/headshot.jpg" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>

                    <FormItem>
                        <FormLabel>Upload a new headshot</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                className='pt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) { // 2MB limit
                                            toast({
                                                title: 'File too large',
                                                description: 'Please upload an image smaller than 2MB.',
                                                variant: 'destructive',
                                            });
                                            e.target.value = ''; // Clear the input
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const dataUrl = reader.result as string;
                                            form.setValue('imageUrl', dataUrl, { shouldValidate: true, shouldDirty: true });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>
            </div>
            
            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Save Changes' : 'Add Actor'}
                </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
