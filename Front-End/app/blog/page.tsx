import { Search } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { Metadata } from "next";
import { getAllBlogs } from "@/services/blog";

interface Blog {
  _id: string;
  title: string;
  content: string;
  shortDescription: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
}

export const metadata: Metadata = {
  title: "Health Platform Blog - Latest Health Articles and Insights",
  description:
    "Explore our collection of expert health articles, medical insights, and wellness tips written by healthcare professionals.",
  keywords:
    "health blog, medical articles, wellness tips, healthcare insights, medical blog",
  openGraph: {
    title: "Health Platform Blog",
    description: "Expert health articles and medical insights",
    type: "website",
    siteName: "Health Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Platform Blog",
    description: "Expert health articles and medical insights",
  },
};

export const dynamic = 'force-dynamic';

async function BlogPage() {
  const blogs = await getAllBlogs();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Health & Wellness Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Stay informed with the latest health insights, medical
            breakthroughs, and wellness tips from our expert doctors
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles by title, content, or author..."
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pl-14 pr-6"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: Blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlogPage;
