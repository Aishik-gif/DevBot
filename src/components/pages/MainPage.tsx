"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export default function MainPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setError(null);

    try {
      if (values.prompt) {
        router.push(`/builder?prompt=${values.prompt}`);
      }
    } catch (error) {
      setError("An error occurred while generating the website.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Description</FormLabel>
                <FormControl>
                  <Input placeholder="Describe your website..." {...field} />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the website you want to
                  generate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Website"}
          </Button>
        </form>
      </Form>
      {error && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
