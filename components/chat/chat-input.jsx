"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatInput = ({apiUrl, query, name, type})=>{
    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content:""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async(values)=>{
        console.log(values);
    }
    

    return (
        <div>
            Chat Input
        </div>
    )
}