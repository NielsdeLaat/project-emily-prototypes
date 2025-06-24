import React, { useState, useEffect } from 'react';

// Import images from the existing project for author profiles
import KadirImg from '../img/Kadir.png';
import emilyImg from '../img/Emily.png';
import carlosImg from '../img/Carlos.png';
import FabriceImg from '../img/Fabrice.png';
import tyroneImg from '../img/Tyrone.png';
import Sae_byeokImg from '../img/Sae_byeok.png';
import MugishaImg from '../img/Mugisha.png';

// Author image mapping
const authorImages = {
  "Kadir": KadirImg,
  "Emily": emilyImg,
  "Carlos": carlosImg,
  "Fabrice": FabriceImg,
  "Tyrone": tyroneImg,
  "Kang Sae-Byeok": Sae_byeokImg,
  "Mugisha": MugishaImg
};

// Category translations and icons
const categoryInfo = {
  religious: { label: "Religieuze Vervolging", icon: "⛪" },
  lgbtq: { label: "LHBTI+ Rechten", icon: "🏳️‍🌈" },
  racism: { label: "Racisme", icon: "✊" },
  political: { label: "Politieke Onderdrukking", icon: "🗳️" },
  gender: { label: "Genderrechten", icon: "♀️" },
  refugee: { label: "Vluchteling", icon: "🏃" }
};

export default function SocialFeed({ 
  sidebarItems, 
  feedPosts, 
  feedAllPosts, 
  feedRecentPostIds, 
  feedNextPostIndex,
  onLike,
  onComment
}) {
  const [newComment, setNewComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // Handle like toggle
  const handleLike = (postId) => {
    onLike(postId);
  };

  // Handle comment submission
  const handleComment = (postId) => {
    if (newComment.trim()) {
      onComment(postId, newComment);
      setNewComment('');
      setActiveCommentPost(null);
    }
  };

  // Get author image
  const getAuthorImage = (personage) => {
    return authorImages[personage] || KadirImg; // fallback to Kadir if not found
  };

  // Get image URL from API
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `https://social-api-sm1s.onrender.com${imagePath}`;
  };

  // Get tags based on post content and type
  const getPostTags = (post) => {
    const tags = [];
    
    // Add tags based on post type
    if (post.type === 'urgent') {
      tags.push('urgent');
    }
    if (post.type === 'trending') {
      tags.push('trending');
    }
    if (post.type === 'unpopular') {
      tags.push('unpopular');
    }
    
    return tags;
  };

  // Get tag styling based on type
  const getTagStyle = (tag) => {
    switch (tag) {
      case 'urgent':
        return {
          icon: '',
          label: 'Urgent',
          className: 'bg-red-100 text-red-700 border border-red-200'
        };
      case 'trending':
        return {
          icon: '',
          label: 'Trending',
          className: 'bg-green-100 text-green-700 border border-green-200'
        };
      case 'unpopular':
        return {
          icon: '',
          label: 'Unpopular',
          className: 'bg-blue-100 text-blue-700 border border-blue-200'
        };
      default:
        return {
          icon: '',
          label: 'Normal',
          className: 'bg-gray-100 text-gray-600 border border-gray-200'
        };
    }
  };

  // Get post styling based on type
  const getPostStyle = (post) => {
    if (post.type === 'urgent') {
      return 'border-l-4 border-red-400 bg-red-50';
    }
    return '';
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Social Feed</h2>
        
        {feedPosts.map((post) => {
          const postTags = getPostTags(post);
          const postStyle = getPostStyle(post);
          
          return (
            <div key={post.id} className={`bg-white rounded-lg shadow-md mb-4 p-4 ${postStyle} relative`}>
              {/* Tags - Positioned top right */}
              {postTags.length > 0 && (
                <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                  {postTags.map((tag) => {
                    const tagStyle = getTagStyle(tag);
                    return (
                      <span
                        key={tag}
                        className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${tagStyle.className}`}
                      >
                        {tagStyle.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Post Header */}
              <div className="flex items-center mb-3">
                <img 
                  src={getAuthorImage(post.personage)} 
                  alt={post.personage}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-800">{post.personage}</div>
                  <div className="text-sm text-gray-500">{post.timestamp}</div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-3">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <img 
                  src={getImageUrl(post.image)} 
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                    post.isLiked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                  }`}
                >
                  <span className={post.isLiked ? 'text-red-500' : ''}>
                    {post.isLiked ? '❤️' : '🤍'}
                  </span>
                  <span className="text-sm">{post.likes}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50"
                >
                  <span>💬</span>
                  <span className="text-sm">{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPost === post.id && (
                <div className="border-t pt-3">
                  {/* Existing Comments */}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="font-medium text-sm text-gray-700">{comment.user}</div>
                      <div className="text-sm text-gray-600">{comment.text}</div>
                    </div>
                  ))}

                  {/* New Comment Input */}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Schrijf een reactie..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emily-blue"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="px-4 py-2 bg-emily-blue text-white rounded-lg hover:bg-emily-blue/90 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 