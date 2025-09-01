"use client";

import { getCookies } from "@/Action/posts";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  description: string;
  type: string;
  likes: number;
  comments: number;
  createdAt: string;
  fromDate?: string;
  toDate?: string;
  postVisibility: string;
  account: {
    fullName: string;
  };
  tag_destinations?: Array<{ id: number; name: string }>;
  tag_hotels?: Array<{ id: number; name: string }>;
  tag_restaurants?: Array<{ id: number; name: string }>;
}

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchToken = async () => {
      const data = await getCookies();
      setToken(data.token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://crm-api-test.vindo.ai/api/v6/customer-portal/post/list",
          {
            method: "GET",
            headers: {
              Authorization: token ? token : "",
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setPosts(result.data?.rows || []);
          setTotalCount(result.data?.count || 0);
        }
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchPosts();
    }
  }, [token]);

  console.log(posts, "sssssssssssss");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="mt-2 text-gray-600">
            Showing {posts.length} of {totalCount} posts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {post.account.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.account.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.type === "trip"
                          ? "bg-blue-100 text-blue-800"
                          : post.type === "request"
                          ? "bg-green-100 text-green-800"
                          : post.type === "moment"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                {post.description && (
                  <p className="text-gray-800 mb-3 line-clamp-3">
                    {post.description}
                  </p>
                )}

                {/* Destinations */}
                {post.tag_destinations && post.tag_destinations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Destinations
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {post.tag_destinations.map((dest) => (
                        <span
                          key={dest.id}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {dest.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotels */}
                {post.tag_hotels && post.tag_hotels.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Hotels
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {post.tag_hotels.slice(0, 2).map((hotel) => (
                        <span
                          key={hotel.id}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          {hotel.name}
                        </span>
                      ))}
                      {post.tag_hotels.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                          +{post.tag_hotels.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Restaurants */}
                {post.tag_restaurants && post.tag_restaurants.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Restaurants
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {post.tag_restaurants.slice(0, 2).map((restaurant) => (
                        <span
                          key={restaurant.id}
                          className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
                        >
                          {restaurant.name}
                        </span>
                      ))}
                      {post.tag_restaurants.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                          +{post.tag_restaurants.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Date Range */}
                {post.fromDate && post.toDate && (
                  <div className="mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(post.fromDate).toLocaleDateString()} -{" "}
                      {new Date(post.toDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Post Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {post.likes}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {post.postVisibility}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No posts found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first post.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostsPage;
