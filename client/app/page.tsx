"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Post, GetPostsResponse } from "@/types/post";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await api.get<GetPostsResponse>("/posts");

        console.log(response.data.data.posts);

        setPosts(response.data.data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-ping rounded-full bg-black"></div>

          <p className="text-xs font-bold uppercase tracking-widest text-black">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {posts.map((post) => (
          <div key={post.id}>
            <h1 className="font-bold">
              {post.title}
            </h1>

            <p>
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}