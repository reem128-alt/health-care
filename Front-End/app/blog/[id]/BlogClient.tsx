"use client";

import { Calendar, User, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getBlogById } from "@/services/blog";

interface Blog {
  _id: string;
  title: string;
  content: string;
  shortDescription: string;
  author: string;
  date: string;
  imageUrl?: string;
}
const url = process.env.NEXT_PUBLIC_API_URL;

export default function BlogClient({ id }: { id: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getBlogById(id);
        if (!response) {
          throw new Error("Failed to fetch blog");
        }
        const blogData: Blog = {
          _id: response._id,
          title: response.title,
          content: response.content,
          shortDescription: response.shortDescription,
          author: response.author,
          imageUrl: response.imageUrl,
          date: response.createdAt,
        };
        setBlog(blogData);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error ?? "Blog not found"}</div>
      </div>
    );
  }

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
        >
          {blog.imageUrl ? (
            <div className="relative h-full">
              <Image
              src={`${url}${blog.imageUrl}`}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-teal-100">
              <div className="text-9xl font-bold text-white/50 drop-shadow-2xl">
                {blog.title.charAt(0)}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
              {blog.title}
            </h1>

            <div className="flex items-center space-x-6 text-gray-600 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center space-x-2 text-purple-600"
              >
                <User className="w-5 h-5" />
                <span>{blog.author}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex space-x-2 text-pink-900"
              >
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center space-x-2 text-teal-600"
              >
                <Clock className="w-5 h-5" />
                <span>5 min read</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-100"
          >
            <div className="prose prose-lg max-w-none">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-purple-800 mb-8 font-medium italic border-l-4 border-purple-400 pl-4"
              >
                {blog.shortDescription}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-gray-700 whitespace-pre-wrap prose-headings:text-purple-900 prose-a:text-pink-600 prose-strong:text-purple-700"
              >
                {blog.content}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
