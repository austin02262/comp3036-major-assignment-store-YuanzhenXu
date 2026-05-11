'use client';

import { useState } from "react";

export function LikeButton({
  postId,
  initialLikes,
  initialLiked,
}: {
  postId: number;
  initialLikes: number; // these two get from server
  initialLiked: boolean;
}) {
  // Keep the button responsive by storing the latest like count and liked state on the client.
  const [likes, setLikes] = useState(initialLikes);// like count
  const [liked, setLiked] = useState(initialLiked);// liked or not

  const toggleLike = async () => {
    // POST adds a like, DELETE removes it; the route returns the new count either way.
    const response = await fetch("/api/likes", {
      method: liked ? "DELETE" : "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),  // send postid to the backend
    });

    if (!response.ok) {
      return; // if request failed then do nothing
    }

    // Sync the UI with the server response instead of guessing the next count locally.
    const data = (await response.json()) as { likes: number; liked: boolean };
    setLikes(data.likes); // get the latest data and update
    setLiked(data.liked);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        data-test-id="like-button"
        onClick={() => void toggleLike()}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {liked ? "Unlike" : "Like"}
      </button>
      <span className="text-sm text-gray-600">{likes} likes</span>
    </div>
  );
}
