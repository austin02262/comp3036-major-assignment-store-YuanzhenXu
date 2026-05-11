interface TagCount {
  name: string;
  count: number;
}

export function tags(posts: { tags: string; active: boolean }[]): TagCount[] {
  const map = new Map<string, number>();       // key string is the tag name , number is the tag appear count

  for (const { tags, active } of posts) {
    if (!active) continue;                   // keep the active one , inactive one just skip

    const tagList = tags
      .split(',')                             // use comma to split 
      .map(t => t.trim())                   // get rid of the blank space front and back
      .filter(t => t !== '');                 // get rid of the empty

    for (const tag of tagList) {
      map.set(tag, (map.get(tag) || 0) + 1);   // take the from the map, if the tag is null/undefined before then start with 0,and then count plus 1.
    }
  }

  return Array.from(map.entries()).map(([name, count]) => ({ name, count })); 
}          //.map(entry=>{
//           const name = entry[0];
//           const count = entry[1];
//return {name,count}
//})

