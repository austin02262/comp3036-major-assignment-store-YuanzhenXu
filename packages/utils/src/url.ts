export function toUrlPath(path: string): string {
  // 空字符串直接返回
  if (path === "") return "";      // if the url is empty then return empty

  return path
    .toLowerCase()                         // all path to lowercase 
    .replace(/[^a-z0-9]+/g, '-')          //Finds any block of one or more characters that are not lowercase letters or digits.
                                          //Replaces each such block with a single hyphen -
    .replace(/^-+|-+$/g, '');             //Removes hyphens at the start (^-+) and at the end (-+$) of the string.
}
// this is the second one in repo/utils