/* eslint-disable @next/next/no-async-client-component */
"use client";


import { Suspense } from "react";



interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

import BlogClient from "./BlogClient";

export default async function BlogPage({ params }: PageProps) {
  const {id} = await params
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      }
    >
      <BlogClient id={id} />
    </Suspense>
  );
}
