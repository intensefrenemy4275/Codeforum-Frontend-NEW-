import React from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post, highResImage }) {
  return (
    <div
      className="post-item"
      style={{
        marginBottom: 24,
        padding: 18,
        border: '1px solid #eee',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        backgroundColor: '#fff',
      }}
    >
      <Link
        to={`/posts/${post._id}`}
        style={{ textDecoration: 'none', color: '#333' }}
      >
        <h3 style={{ marginBottom: 12 }}>{post.title}</h3>
      </Link>

      {post.media && (
        <img
          src={post.media}
          alt="Post media"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: 520,
            maxHeight: 350,
            objectFit: highResImage ? 'cover' : 'contain',
            borderRadius: 8,
            margin: '0 auto 12px auto',
            imageRendering: 'auto',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
          loading="lazy"
        />
      )}

      <p style={{ marginBottom: 8, color: '#555', whiteSpace: 'pre-wrap' }}>
        {post.content?.slice(0, 150)}{post.content?.length > 150 ? '...' : ''}
      </p>

      <div style={{ fontSize: 14, color: '#999' }}>
        <span>{post.likes} Likes</span> | <span>{post.comments?.length || 0} Comments</span>
      </div>
    </div>
  );
}

export default PostItem;
