import type { PropsWithChildren } from "react";

export function LinkList({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <div>{title}</div>
      {children}
    </>
  );
}

// this one is the important for the form of the left menu , title and the content