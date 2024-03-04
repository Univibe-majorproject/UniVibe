"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";
import {Pen} from "lucide-react";

const CreatePostBtn = () => {
  const { onOpen } = useModal();

  return (
    <button
      type="button"
      onClick={() => onOpen("createPost")}
      className="bg-purple-800 rounded-full text-lg font-bold sticky top-0 mb-4 z-10 w-full flex items-center justify-center py-2 border-2 border-purple-200"
    >
      Create Post
      <Pen className="h-6 w-6 top-0 ml-5"/>
    </button>
  );
};

export default CreatePostBtn;
