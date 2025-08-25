import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { 
  CheckCircleIcon, 
  MapPinIcon, 
  UserPlusIcon, 
  UsersIcon,
  SparklesIcon,
  HeartIcon,
  GlobeIcon
} from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <SparklesIcon className="size-4" />
              Language Exchange Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Connect & Learn Together
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Build meaningful friendships while mastering new languages
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-12 lg:space-y-16">
        {/* Friends Section */}
        <section className="space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                  Your Learning Circle
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Your trusted language partners
              </p>
            </div>
            <Link 
              to="/notifications" 
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <UsersIcon className="size-4" />
                <span className="hidden sm:inline">Friend Requests</span>
                <span className="sm:hidden">Requests</span>
              </div>
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-gray-700 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 lg:p-12 text-center transition-all duration-300 hover:shadow-xl">
              <NoFriendsFound />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {friends.map((friend, index) => (
                <div
                  key={friend._id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <FriendCard friend={friend} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Users Section */}
        <section className="space-y-6 lg:space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 rounded-full px-4 py-2 text-sm font-medium">
              <GlobeIcon className="size-4" />
              Discover New Connections
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
              Meet Your Perfect Language Partners
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Carefully curated matches based on your learning goals and interests
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 dark:border-gray-700 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-2xl shadow-lg p-8 lg:p-12 text-center transition-all duration-300 hover:shadow-xl">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <HeartIcon className="size-8 text-white" />
                </div>
                <h3 className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-white">
                  No recommendations available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                  Check back later for new language partners!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {recommendedUsers.map((user, index) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 focus-within:ring-4 focus-within:ring-blue-300 dark:focus-within:ring-blue-700"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Card Header with Gradient */}
                    <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 relative">
                      <div className="absolute inset-0 bg-black opacity-10"></div>
                      <div className="absolute -bottom-8 left-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden shadow-lg">
                            <img 
                              src={user.profilePic} 
                              alt={user.fullName}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-12 pb-6 px-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {user.fullName}
                        </h3>
                        {user.location && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPinIcon className="size-4 mr-2 text-red-400" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Languages Section */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium">
                            <span className="text-lg">{getLanguageFlag(user.nativeLanguage)}</span>
                            <span>Native: {capitialize(user.nativeLanguage)}</span>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
                            <span className="text-lg">{getLanguageFlag(user.learningLanguage)}</span>
                            <span>Learning: {capitialize(user.learningLanguage)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Section */}
                      {user.bio && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            "{user.bio}"
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 transform hover:scale-105 ${
                          hasRequestBeenSent
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed opacity-75"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-300 dark:focus:ring-blue-700"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </>
                          ) : hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-5" />
                              <span>Request Sent</span>
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-5" />
                              <span>Send Friend Request</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
