import type { Post } from "@repo/db/data";

function cleanTitle(title: string): string {
  
  return title.replace(/!/g, '');          // no !,
}

function formatDate(date: Date): string {
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}               // date should be : "DD,MMM,YYYY"

export function BlogListItem({ post }: { post: Post }) {
  const tags = post.tags.split(',').map(tag => tag.trim());// let "a,b,c"=>'a','b','c'

  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}   //data test id should be the same as post id
    >
      
      <a href={`/post/${post.urlId}`}>{cleanTitle(post.title)}</a>   //click the url to see the post details
      <span>{post.category}</span>               // show the post category
      {tags.map(tag => (
        <span key={tag}>#{tag}</span>         // post tag and add#before each tag
      ))}
      // show the tag
      <time>{formatDate(post.date)}</time>  
      <span>{post.views} views</span>       
      <span>{post.likes} likes</span>      
    </article>
  );
}
