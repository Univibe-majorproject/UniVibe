"use client";
import * as z from "zod";


const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatInput = ({apiUrl, query, name, type})=>{
    return (
        <div>
            Chat Input
        </div>
    )
}