/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, User, Trash2, Heart, Pencil } from 'lucide-react';


export interface Blog {
  _id: string;
  title: string;
  content: string;
  shortDescription: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
}

interface BlogCardProps {
  blog?: Blog;
  _id?: string;
  title?: string;
  content?: string;
  shortDescription?: string;
  author?: string;
  imageUrl?: string;
  createdAt?: string;
  showDeleteButton?: boolean;
  onDelete?: (id: string) => void;
  showEditButton?: boolean;
  onEdit?: (blog: Blog) => void;
}

export default function BlogCard({ 
  blog,
  _id: propId,
  title: propTitle,
  content: propContent,
  shortDescription: propShortDescription,
  author: propAuthor,
  imageUrl: propImageUrl,
  createdAt: propCreatedAt,
  showDeleteButton = false, 
  onDelete,
  showEditButton = false,
  onEdit
}: BlogCardProps) {
  // Use either direct props or blog object props
  const _id = blog?._id ?? propId ?? '';
  const title = blog?.title ?? propTitle ?? '';
  const content = blog?.content ?? propContent ?? '';
  const shortDescription = blog?.shortDescription ?? propShortDescription ?? '';
  const author = blog?.author ?? propAuthor ?? '';
  const imageUrl = blog?.imageUrl ?? propImageUrl;
  const createdAt = blog?.createdAt ?? propCreatedAt;



  const formattedDate = createdAt 
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Ensure consistent timezone between server and client
      }).format(new Date(createdAt))
    : 'No date available';

  const blogData: Blog = {
    _id,
    title,
    content,
    shortDescription,
    author,
    imageUrl,
    createdAt
  };

  return (
    <div className="group relative h-[28rem] sm:w-[400px] max-sm:w-full">
      {/* Decorative border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
      
      {/* Main card content */}
      <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image section - fixed height */}
        <div className="relative h-64 w-full">
          {imageUrl ? (
            <div className="w-full h-full">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-purple-500/70" />
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{author}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {shortDescription || content}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex space-x-2">
              {showEditButton && (
                <button
                  onClick={() => onEdit?.(blogData)}
                  className="p-2 text-purple-600 hover:text-purple-800 transition-colors"
                  title="Edit blog"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              )}
              {showDeleteButton && (
                <button
                  onClick={() => onDelete?.(_id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete blog"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <Link
              href={`/blog/${_id}`}
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              Read More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
