"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

export const FileUpload = ({
    onChange,
    value,
    endpoint
}) => {
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