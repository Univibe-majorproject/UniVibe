"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";
import { Pen } from "lucide-react";

const CreatePostBtn = () => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-center max-w-5xl sticky top-0 z-10">
      <button
        type="button"
        onClick={() => onOpen("createPost")}
        className="bg-purple-800 rounded-full text-lg font-bold mb-4 w-fit flex items-center justify-center py-2 px-20 border-2 border-white"
      >
        Create Post
        <Pen className="h-6 w-6 top-0 ml-5" />
      </button>
    </div>
  );
};

export default CreatePostBtn;
