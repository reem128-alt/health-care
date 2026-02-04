import React from "react"
import { UseFormReturn } from "react-hook-form"

export interface BlogFormValues {
  title: string
  shortDescription: string
  content: string
}

interface BlogFormProps {
  form: UseFormReturn<BlogFormValues>
  isSubmitting: boolean
  editingBlog: { _id: string } | null
  onSubmit: (values: BlogFormValues) => void | Promise<void>
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const BlogForm: React.FC<BlogFormProps> = ({
  form,
  isSubmitting,
  editingBlog,
  onSubmit,
  onImageChange
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-purple-500 focus:ring-purple-400/40"
            placeholder="e.g. How to prepare for your first cardiology visit"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Short Description</label>
          <textarea
            {...register("shortDescription", { required: "Short description is required" })}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-purple-500 focus:ring-purple-400/40"
            rows={3}
            placeholder="One or two sentences that summarize the insight."
          />
          {errors.shortDescription && (
            <p className="mt-1 text-xs text-red-500">{errors.shortDescription.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-purple-500 focus:ring-purple-400/40"
            rows={8}
            placeholder="Share the full story, structured for patients."
          />
          {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="mt-2 block w-full rounded-xl border border-dashed border-purple-300 bg-purple-50/30 px-4 py-3 text-sm text-slate-600 shadow-inner focus:border-purple-400 focus:ring-purple-400/40"
          />
          <p className="mt-1 text-xs text-slate-500">Upload a hero image to bring the article to life.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-colors hover:bg-purple-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : editingBlog ? "Save Changes" : "Publish Blog"}
        </button>
      </div>
    </form>
  )
}
