import { useEffect, useState } from "react";
import { Link, useLoaderData } from "remix";
import type { Post } from "~/utils/post";
import { getPosts } from "~/utils/post";

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div className="main prose lg:prose-2xl max-w-none">
      <h1
        className={`lg:my-20 my-10 animate__animated animate__backInDown py-10 lg:py-40 lg:text-8xl text-center drop-shadow-2xl text-white decoration-black decoration-double bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl`}
      >
        Oldweb2 Blog
      </h1>

      <div className="content mx-auto">
        <h2 className="mx-10 lg:text-2xl">Posts</h2>
        <ul className="list-disc mx-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="font-bold" to={post.slug}>
                {post.title}
              </Link>
              <div className="italic">{post?.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
