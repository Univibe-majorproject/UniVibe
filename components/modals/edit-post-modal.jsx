"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
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
import { useEffect } from "react";

//creating our form schema
const formSchema = z.object({
  content: z.string().min(1, {
    message: "Cannot create empty post",
  }),
  fileUrl: z.string().optional(),
});

export const EditPostModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "editPost";
  const { postId, content, fileUrl } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  useEffect(()=>{
    if(postId) {
      form.setValue("content",content );
      form.setValue("fileUrl", fileUrl);
    }
  }, [postId, form ])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/socket/posts",
        query: {
          serverId: params?.serverId,
          channelId: params?.channelId,
        }
      })

      await axios.post(url, values);
      
      form.reset();
      router.refresh();
      onClose();
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
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-3xl">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit this Post
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
