import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Blog {
  shortDescription: string;
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Get all blogs
export const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await axios.get(`${API_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    throw error;
  }
};

// Create new blog
export const createBlog = async (blogData: FormData): Promise<Blog> => {
  try {
    const response = await axios.post(`${API_URL}/blogs`, blogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (id: string, blogData: FormData): Promise<Blog> => {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with id ${id}:`, error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/blogs/${id}`);
  } catch (error) {
    console.error(`Error deleting blog with id ${id}:`, error);
    throw error;
  }
};