import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../UI/NavBar";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  AlertTriangle,
  Check,
  Search,
  Filter,
  Star,
  Calendar,
  ChevronRight,
  MessageSquare,
  Edit,
  Trash2,
  Store,
  Clock,
  CalendarDays,
  Package,
} from "lucide-react";

const MyReviews = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [editFormData, setEditFormData] = useState({
    review: "",
    starRate: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Failed to parse userData from localStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/"); // Redirect to home
  };

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return; // wait until token is available

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "http://localhost:8070/api/user/review/my-reviews",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        setReviews(response.data);
      } catch (err) {
        setError("Failed to fetch reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleEditOpen = (review) => {
    setSelectedReview(review);
    setEditFormData({
      review: review.review,
      starRate: review.starRate,
    });
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedReview(null);
    setEditFormData({
      review: "",
      starRate: 0,
    });
  };

  const handleDeleteOpen = (reviewID) => {
    setReviewToDelete(reviewID);
    setDeleteReason("");
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
    setDeleteReason("");
    setDeleteError(null);
  };

  const handleDeleteReasonChange = (e) => {
    setDeleteReason(e.target.value);
    if (deleteError) {
      setDeleteError(null);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditReview = async () => {
    if (!selectedReview) return;
    
    if (editFormData.starRate === 0) {
      setError("Please select a star rating");
      return;
    }

    if (!editFormData.review.trim()) {
      setError("Please provide a review text");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const updatedData = {
        review: editFormData.review,
        starRate: parseInt(editFormData.starRate),
      };

      await axios.patch(
        `http://localhost:8070/api/user/review/edit-review/${selectedReview._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update reviews list
      setReviews((prev) =>
        prev.map((review) =>
          review._id === selectedReview._id
            ? { ...review, ...updatedData }
            : review
        )
      );
      
      setSuccess("Review updated successfully!");
      handleEditClose();
    } catch (err) {
      setError("Failed to update review");
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    if (!deleteReason.trim()) {
      setDeleteError("Please provide a reason for deletion.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await axios.delete(
        `http://localhost:8070/api/user/review/delete-review/${reviewToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prev) =>
        prev.filter((review) => review._id !== reviewToDelete)
      );
      
      setSuccess("Review deleted successfully!");
      handleDeleteClose();
    } catch (err) {
      setError("Failed to delete review");
      console.error(err);
    }
  };

  // Filter and search reviews
  const filteredReviews = reviews.filter((review) => {
    // Rating filter
    if (filterRating !== "all" && review.starRate.toString() !== filterRating) return false;

    // Search query filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        review.review?.toLowerCase().includes(query) ||
        review.providerID?.name?.toLowerCase().includes(query) ||
        review.bookingService?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Star Rating Component
  const StarRating = ({
    rating,
    hoverRating,
    onRatingChange,
    onHoverChange,
    interactive = true,
  }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
      <div className="flex">
        {stars.map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "span"}
            disabled={!interactive}
            onClick={interactive ? () => onRatingChange(star) : undefined}
            onMouseEnter={interactive ? () => onHoverChange(star) : undefined}
            onMouseLeave={interactive ? () => onHoverChange(0) : undefined}
            className={`${interactive ? "cursor-pointer focus:outline-none" : ""} mr-1 transition-colors duration-200`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={24}
              className={`${
                (hoverRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Display-only Star Rating
  const DisplayStars = ({ rating }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex">
        {stars.map((star) => (
          <Star
            key={star}
            size={18}
            className={`${
              rating >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } mr-1`}
          />
        ))}
      </div>
    );
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar - Added at the top level */}
      <NavBar handleLogout={handleLogout} user={userData} />
      
      {/* Notification Toasts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Check size={18} />
            <span>{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-4 hover:opacity-80"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 hover:opacity-80"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-14 md:py-20 max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              My Reviews
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl">
              Manage your reviews and see your feedback history.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && filteredReviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-12 rounded-xl text-center"
            >
              <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              {searchQuery || filterRating !== "all" ? (
                <>
                  <p className="font-medium text-lg">
                    No matching reviews found.
                  </p>
                  <p className="mt-2 text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterRating("all");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg">No reviews found.</p>
                  <p className="mt-2 text-gray-600">
                    You haven't reviewed any service providers yet.
                  </p>
                </>
              )}
            </motion.div>
          )}

          {filteredReviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side: Review details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {review.providerID?.name || "Unknown Provider"}
                      </h3>
                      <div className="flex items-center">
                        <DisplayStars rating={review.starRate} />
                      </div>
                    </div>

                    <div className="text-gray-700 mt-2 mb-4">
                      <p className="text-base">{review.review}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                      {review.bookingService && (
                        <div className="flex items-center text-gray-700">
                          <Package size={16} className="mr-2 text-violet-500" />
                          <span className="text-sm font-medium">
                            {review.bookingService}
                          </span>
                        </div>
                      )}
                      {review.createdAt && (
                        <div className="flex items-center text-gray-700">
                          <CalendarDays
                            size={16}
                            className="mr-2 text-blue-500"
                          />
                          <span className="text-sm">
                            Posted on: {formatDate(review.createdAt)}
                          </span>
                        </div>
                      )}
                      {review.updatedAt && review.updatedAt !== review.createdAt && (
                        <div className="flex items-center text-gray-700">
                          <Clock size={16} className="mr-2 text-blue-500" />
                          <span className="text-sm">
                            Updated on: {formatDate(review.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Actions */}
                  <div className="flex md:flex-col justify-end gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEditOpen(review)}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                      aria-label={`Edit review for ${review.providerID?.name || "provider"}`}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOpen(review._id)}
                      className="px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      aria-label={`Delete review for ${review.providerID?.name || "provider"}`}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Review Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={handleEditClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <h2
                  id="edit-modal-title"
                  className="text-xl font-bold flex items-center"
                >
                  <Edit className="mr-3 h-5 w-5" />
                  Edit Your Review
                </h2>
                <p className="text-blue-100 mt-1 text-sm">
                  Update your feedback for{" "}
                  {selectedReview?.providerID?.name || "this provider"}
                </p>
                <button
                  onClick={handleEditClose}
                  className="absolute top-4 right-4 text-white hover:text-blue-100 transition-colors duration-200"
                  aria-label="Close edit modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Star Rating */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <Star className="mr-2 text-yellow-500 h-4 w-4" />
                    Your Rating
                  </label>
                  <div className="mt-2">
                    <StarRating
                      rating={parseInt(editFormData.starRate)}
                      hoverRating={hoveredRating}
                      onRatingChange={(rating) => 
                        setEditFormData(prev => ({ ...prev, starRate: rating }))
                      }
                      onHoverChange={setHoveredRating}
                    />
                  </div>
                  {editFormData.starRate > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {editFormData.starRate === 1 && "Poor"}
                      {editFormData.starRate === 2 && "Fair"}
                      {editFormData.starRate === 3 && "Good"}
                      {editFormData.starRate === 4 && "Very Good"}
                      {editFormData.starRate === 5 && "Excellent"}
                    </p>
                  )}
                </div>

                {/* Review Text */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <MessageSquare className="mr-2 text-blue-500 h-4 w-4" />
                    Your Review
                  </label>
                  <textarea
                    name="review"
                    value={editFormData.review}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 resize-none h-32"
                    placeholder="Share your experience with this service provider..."
                    aria-label="Enter your review"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleEditClose}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditReview}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center shadow-sm"
                    aria-label="Save changes"
                  >
                    <span>Save Changes</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Review Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={handleDeleteClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <h2
                  id="delete-modal-title"
                  className="text-xl font-bold flex items-center"
                >
                  <AlertTriangle className="mr-3 h-5 w-5" />
                  Delete Review
                </h2>
                <p className="text-red-100 mt-1 text-sm">
                  Please provide a reason for deletion
                </p>
                <button
                  onClick={handleDeleteClose}
                  className="absolute top-4 right-4 text-white hover:text-red-100 transition-colors duration-200"
                  aria-label="Close delete modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Deletion Reason */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <MessageSquare className="mr-2 text-red-500 h-4 w-4" />
                    Reason for Deletion
                  </label>
                  <textarea
                    value={deleteReason}
                    onChange={handleDeleteReasonChange}
                    className={`w-full border ${
                      deleteError
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-gray-50 resize-none h-32`}
                    placeholder="Please explain why you're deleting this review..."
                    aria-label="Enter reason for deletion"
                  />
                  {deleteError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      {deleteError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleDeleteClose}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    aria-label="Cancel deletion"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center shadow-sm"
                    aria-label="Confirm deletion"
                  >
                    <span>Confirm Deletion</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReviews;