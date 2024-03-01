"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { FileUpload } from "@/components/file-upload";

import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";


//creating our form schema
const formSchema = z.object({
  content: z.string().min(1, {
    message: "Cannot create empty post",
  }),
  fileUrl: z.string().optional(),
});

export const CreatePostModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { channelType } = data;
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createPost";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    // try {
    //   const url = qs.stringifyUrl({
    //     url: "/api/channels",
    //     query: {
    //       serverId: params?.serverId,
    //     }
    //   })

    //   await axios.post(url, values);

    //   form.reset();
    //   router.refresh();
    //   onClose();
    // } catch (error) {
    //   console.log(error);
    // }
    try {
        console.log("Post created", values);
        onClose();
    } catch (error) {
        console.error(error);
    }
    
  };

  //custom on close function
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-3xl">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a new Post
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                                dark:text-secondary/70"
                    >
                      Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={`${isLoading}`}
                        placeholder="What do you want to talk about in the post."
                        className="bg-zinc-400/40 border-0
                        focus-visible:ring-0 text-black 
                        focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter className={"bg-grey-100 px-6 py-4"}>
              <Button disable={`${isLoading}`} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
