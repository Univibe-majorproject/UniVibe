"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { UserButton } from "@clerk/nextjs";
import { ListPlus } from "lucide-react";

const DATE_FORMAT = "yyyy-MM-dd";

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

const validateName = (fieldName) => {
  return z.string()
      .trim()
      .min(1, `${fieldName} is required`)
      .refine(value => {
        return /^(?!\d$)[^\d].*$/.test(value);
      }, { message: `${fieldName} cannot start with a number or consist only of numbers` });
};

const formSchema = z.object({
  profileBio: z
    .string()
    .max(255, "Profile bio cannot exceed 255 characters")
    .optional(), // Optional with max length

  collegeName: validateName("College name"),
  course: validateName("Course name"),
  branch: validateName("Branch name"),

  // collegeName: z.string().trim().min(1, "College name is required"),
  // course: z.string().trim().min(1, "Course name is required"),
  // branch: z.string().trim().min(1, "Branch name is required"),

  batch: z.string().trim().min(1, { message: "Invalid batch year" }), // Ensures positive integer for batch
  dob: z.coerce.date(), // Validates date format
  socialProfiles: z
    .object({
      linkedin: z.string().url({ message: "Invalid LinkedIn URL" }).optional(), // Optional LinkedIn URL validation
      github: z.string().url({ message: "Invalid GitHub URL" }).optional(), // Optional GitHub URL validation
    })
    .optional(), // Optional field for social profiles

    skills: z.array(z.string().trim())
    .superRefine((data, ctx) => {
      if (data.length > 10) {
        ctx.addIssue({ 
          code: z.ZodIssueCode.too_big,
          inclusive: true,
          maximum:10,
          type:"array",
          message: "Maximum 10 skills allowed" });
      }
      if(data.length === 1 &&  data[0] === ""){
        ctx.addIssue({  
          code: z.ZodIssueCode.too_small,
          inclusive: true,
          minimum:1,
          type:"array",
          message: "Add atleast one skill." });
    }}) // Array with max 10 skills using superRefine
});

export const MoreDetailsForm = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(true);

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
      skills: [], // Set default empty array for skills
    },
  });

  const onSubmit = (values) => {
    const {
      profileBio,
      collegeName,
      batch,
      branch,
      course,
      dob,
      socialProfiles,
      skills,
    } = values;

    user.update({
      unsafeMetadata: {
        profileBio,
        collegeName,
        course,
        branch,
        batch,
        dob: format(dob, DATE_FORMAT),
        socialProfiles,
        skills,
      },
    });
    window.location.reload();
    setIsEditing(false);
  };

  const handleSkillsChange = (event) => {
    const skills = event.target.value.split(",").map((skill) => skill.trim());
    form.setValue("skills", skills); // Update form state using setValue
  };

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (user) {
      form.setValue("profileBio", user.unsafeMetadata?.profileBio);
      form.setValue("collegeName", user.unsafeMetadata?.collegeName);
      form.setValue("course", user.unsafeMetadata?.course);
      form.setValue("branch", user.unsafeMetadata?.branch);
      form.setValue("batch", user.unsafeMetadata?.batch);
      form.setValue("dob", user.unsafeMetadata?.dob);
      form.setValue(
        "socialProfiles.linkedin",
        user.unsafeMetadata?.socialProfiles?.linkedin
      );
      form.setValue(
        "socialProfiles.github",
        user.unsafeMetadata?.socialProfiles?.github
      );
      form.setValue("skills", user.unsafeMetadata?.skills);
    }
  }, [user, form]);

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "h-[48px] w-[48px]",
        },
      }}
    >
      <UserButton.UserProfilePage
        label="More Details"
        labelIcon={<ListPlus className="w-5 h-5" />}
        url="more-details"
      >
        {isEditing ? 
        <div className="bg-white text-black">
          <Form {...form}>
            <form
              className="w-full pt-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
              <Button
                disabled={isLoading}
                size="sm"
                className="bg-purple-700 my-4"
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
        : <div className="bg-white text-black">
          <h2>Details Saved!</h2>
        </div>
        }
      </UserButton.UserProfilePage>
    </UserButton>
  );
};
