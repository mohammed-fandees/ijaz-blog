/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

interface PostPreviewProps {
  post: any
  onBack: () => void
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, onBack }) => {
  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded">رجوع</button>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="mb-4 text-gray-500">{post.excerpt}</div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="mt-4">
        <strong>العلامات:</strong> {post.tags && post.tags.join(', ')}
      </div>
      <div className="mt-2 text-sm text-gray-400">
        وقت القراءة: {post.reading_time} دقيقة
      </div>
    </div>
  )
}
