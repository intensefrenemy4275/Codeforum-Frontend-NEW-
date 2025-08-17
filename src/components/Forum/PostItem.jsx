import React from 'react';
import { Link } from 'react-router-dom';

function PostItem({ post }) {
  return (
    <div className="post-item" style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 10 }}>
      <div>
        <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: '#222' }}>
          <h3>{post.title}</h3>
        </Link>
        {post.media && (
          <img
            src={post.media}
            alt="Post media"
            style={{
              width: '100%',
              maxWidth: 512,
              maxHeight: 330,
              objectFit: 'cover',         // ensures image fills box crisply!
              borderRadius: 6,
              margin: '14px 0'
            }}
            loading="lazy"
          />
        )}
        <p>
          {post.content?.slice(0, 180)}
          {post.content?.length > 180 ? '...' : ''}
        </p>
        <div style={{ fontSize: 13, color: '#888' }}>
          <span>{post.likes} Likes</span> | <span>{post.comments?.length || 0} Comments</span>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
