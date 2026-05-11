export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  const result: string[] = [];   //Creates an empty array to collect all valid class names 

  for (const item of classes) {          
    if (!item) continue;                // loop through all (item) that was passed to the function.
    if (typeof item === 'string') {     // if it's null or unidentified, then skip. if type of item is string then push
      
      result.push(item);
    } else if (typeof item === 'object') {            // check if the type is object  {b:true}
     
      for (const [key, value] of Object.entries(item)) {          // if yeah, then change the object to key,value form
        if (value) {                                  // if the value is true
          result.push(key);
        }
      }
    }
  }

  return result.join(' ');
}

// fix the first one in repo/utils