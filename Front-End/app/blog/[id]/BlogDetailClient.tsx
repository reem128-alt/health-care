'use client';

import { Calendar, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function BlogDetailClient({ blog }: { blog: Blog }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{new Date(blog.date).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Blog Image */}
      {blog.imageUrl && (
        <div className="mb-8 relative h-[400px] w-full">
          <Image
            src={`${url}${blog.imageUrl}`}
            alt={blog.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </motion.div>
  );
}
