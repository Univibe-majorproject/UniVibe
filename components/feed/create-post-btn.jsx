"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";

const CreatePostBtn = () => {
  const { onOpen } = useModal();

  return (
    <button
      type="button"
      onClick={() => onOpen("createPost")}
      className="bg-purple-500 rounded-full text-lg font-bold w-56 sticky top-0 mb-4 z-10"
    >
      Create Post
    </button>
  );
};

export default CreatePostBtn;
