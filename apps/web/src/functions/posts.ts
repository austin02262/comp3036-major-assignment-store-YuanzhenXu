import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

type PostWithLikeCount = Omit<Post, "likes"> & {
  _count: {
    likes: number;  //take the database form and change to the form frontend needed
  };
};

function withLikes(post: PostWithLikeCount): Post {
  const { _count, ...data } = post;

  return {
    ...data,
    likes: _count.likes,
  };
}

export async function getPublicPosts(): Promise<Post[]> {
  const posts = await client.db.post.findMany({ //checkdatabase
    where: {
      active: true, //only take the data when article is active
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      date: "desc", //latest put in the front
    },
  });

  return posts.map(withLikes);
}
