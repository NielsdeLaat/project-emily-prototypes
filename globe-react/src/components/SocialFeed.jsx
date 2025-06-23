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

export default function SocialFeed({ sidebarItems }) {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [nextPostIndex, setNextPostIndex] = useState(0);
  const [allPosts, setAllPosts] = useState([]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://social-api-sm1s.onrender.com/posts');
        const result = await response.json();
        if (result.success && result.data) {
          console.log('SocialFeed: Fetched posts from API:', result.data.length);
          setAllPosts(result.data);
          // Start with first post
          if (result.data.length > 0) {
            setPosts([result.data[0]]);
            setNextPostIndex(1);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Add new post every 15 seconds
  useEffect(() => {
    if (allPosts.length === 0) return;

    console.log('SocialFeed: Setting up interval, nextPostIndex:', nextPostIndex, 'total posts:', allPosts.length);
    const interval = setInterval(() => {
      console.log('SocialFeed: Adding new post, nextPostIndex:', nextPostIndex);
      if (nextPostIndex < allPosts.length) {
        const newPost = {
          ...allPosts[nextPostIndex],
          id: Date.now(), // Unique ID for each post instance
          timestamp: "Nu"
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setNextPostIndex(prev => prev + 1);
      } else {
        // If we've shown all posts, start over with random selection
        const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
        const newPost = {
          ...randomPost,
          id: Date.now(),
          timestamp: "Nu"
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [nextPostIndex, allPosts]);

  // Handle like toggle
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  // Handle comment submission
  const handleComment = (postId) => {
    if (newComment.trim()) {
      const randomAuthor = Object.keys(authorImages)[Math.floor(Math.random() * Object.keys(authorImages).length)];
      const newCommentObj = {
        id: Date.now(),
        user: randomAuthor,
        text: newComment,
        timestamp: new Date().toISOString()
      };

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      }));

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

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Social Feed</h2>
        
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
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
        ))}
      </div>
    </div>
  );
} 