"use client";

//index.tsx
import { OutputData } from "@editorjs/editorjs";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(() => import("../components/editor/Editor"), {
  ssr: false,
});

const Home: NextPage = () => {
  //state to hold output data. we'll use this for rendering later
  const [data, setData] = useState<OutputData>();
  return (
    <main>
      <EditorBlock data={data} onChange={setData} holder="editorjs-container" />
    </main>
  );
};

export default Home;
