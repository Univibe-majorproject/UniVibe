"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

export const FileUpload = ({
    onChange,
    value,
    endpoint
}) => {
    // check if we have a value? render something : not 
    const fileType = value?.split(".").pop();
    if(value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
            </div>
        )
    }


    return(
        <UploadDropzone
         endpoint={endpoint}
         onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
         }}
         onUploadError={(error) =>{
            console.log(error);
         }}
        />
    )
}