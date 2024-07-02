"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

//creating our form schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Server name is required.",
    })
    .max(60, {
      message: "Server name cannot exceed 60 characters.",
    }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
  collegeCode: z.string().min(1, {
    message: "College code is required.",
  }),
  collegeDomain: z.string().min(1, {
    message: "College domain is required.",
  }),
});

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      collegeCode: "",
      collegeDomain: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
      form.setValue("collegeCode", server.collegeCode);
      form.setValue("collegeDomain", server.collegeDomain);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  //storing college domain without '@' and in lowercase.
  // const normalizeCollegeDomain = (event) => {
  //   const enteredcollegeDomain = event.target.value;
  //   let normalizedDomain = enteredcollegeDomain.trim().toLowerCase();

  //   if (normalizedDomain.includes("@")) {
  //     normalizedDomain = normalizedDomain.split("@")[1];
  //   }

  //   form.setValue("collegeDomain", normalizedDomain);
  // };

  //on submit function that creates server, if server not present
  const onSubmit = async (values) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);

      form.reset();
      router.refresh();
      onClose();
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  //custom on close function
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your College Network
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your college network a personality with a name and an image.
            You can always change it again.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      College Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={`${isLoading}`}
                        className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                        placeholder="Enter college name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collegeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Unique College Code
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={`${isLoading}`}
                        className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-black 
                                    focus-visible:ring-offset-0"
                        placeholder="Enter unique college code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collegeDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      College Email Domain
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={`${isLoading}`}
                        className="bg-zinc-300/50 border-0
                                    focus-visible:ring-0 text-gray-600 
                                    focus-visible:ring-offset-0 cursor-not-allowed"
                        placeholder="Enter college email domain (eg. @college.edu.in)"
                        value = {form.value}
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={"bg-grey-100 px-6 py-4"}>
              <Button disable={`${isLoading}`} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
