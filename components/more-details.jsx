import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  profileBio: z
    .string()
    .max(255, "Profile bio cannot exceed 255 characters")
    .optional(), // Optional with max length
  collegeName: z.string().trim().min(1, "College name is required"),
  course: z.string().trim().min(1, "Course name is required"),
  branch: z.string().trim().min(1, "Branch name is required"),
  batch: z.string().trim().min(1,{ message: "Invalid batch year" }), // Ensures positive integer for batch
  dob: z.coerce.date(), // Validates date format
  socialProfiles: z
    .object({
      linkedin: z.string().url({ message: "Invalid LinkedIn URL" }).optional(), // Optional LinkedIn URL validation
      github: z.string().url({ message: "Invalid GitHub URL" }).optional(), // Optional GitHub URL validation
    })
    .optional(), // Optional field for social profiles
  skills: z
    .array(z.string().trim().min(1, "Skill cannot be empty"))
    .superRefine((data, ctx) => {
      if (data.length > 10) {
        ctx.addIssue({ message: "Maximum 10 skills allowed" });
      }
    }), // Array with max 10 skills using superRefine
});

export const MoreDetailsForm = () => {
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(formSchema), // Use your defined schema here
    defaultValues: {
      profileBio: "", // Set default empty string for profileBio
      collegeName: "", // Set default empty string for collegeName
      course: "", // Set default empty string for course
      branch: "", // Set default empty string for branch
      batch: "", // Set default value of 0 for batch (adjust if needed)
      dob: "1000-01-01",
      socialProfiles: {
        // Set default empty objects for social profiles
        linkedin: "",
        github: "",
      },
      skills: ["communication"], // Set default empty array for skills
    },
  });

  const onSubmit = async (values) => {
    console.log(values);

    // user.update({
    //     unsafeMetadata: {},
    //   });
  };

  const handleSkillsChange = (event) => {
    const skills = event.target.value.split(",").map((skill) => skill.trim());
    form.setValue("skills", skills); // Update form state using setValue
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="bg-white text-black">
      <Form {...form}>
        <form className="w-full pt-2" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Profile BIO FIELDS */}
          <FormField
            control={form.control}
            name="profileBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Profile Bio
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Enter a nice profile bio..."
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  {/* College Name FIELDS */}
            <FormField
            control={form.control}
            name="collegeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                     College Name
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="College Name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  {/*  Course FIELDS */}
            <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Course
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Course"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {/*  Branch FIELDS */}

            <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                     Branch
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Branch"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {/*  Batch FIELDS */}

            <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Batch
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Batch"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  DOB FIELDS */}

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      DOB
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      type="date"
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Enter your date of birth"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {/*  Social Profiles FIELDS */}
            {/* LINKEDIN */}
            <FormField
            control={form.control}
            name="socialProfiles.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Linkedin URL
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Enter linkedin profile url..."
                      {...field}
                      url=""
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            {/* GITHUB */}
            <FormField
            control={form.control}
            name="socialProfiles.github"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Github URL
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Enter github profile url..."
                      {...field}
                      url=""
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SKILLS FIELD */}

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                     Skills
                </FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Input
                      disabled={`${isLoading}`}
                      className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                      placeholder="Enter your skills separated by commas (max 10 skills)"
                      {...field}
                      onChange={handleSkillsChange}
                    
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} size="sm" className="bg-purple-700 my-4">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};
