"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";

const CreatePostBtn = () => {
  const { onOpen } = useModal();

  return (
    <button
      type="button"
      onClick={() => onOpen("createPost")}
      className="bg-purple-500 rounded-full text-lg font-bold w-56"
    >
      Create Post
    </button>
  );
};

export default CreatePostBtn;
