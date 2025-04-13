import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/FinancialHome.css';

export default function AllDetails() {
  const [clothingItems, setClothingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetchClothingItems();
  }, []);

  const fetchClothingItems = async () => {
    try {
      const response = await fetch('/api/auth/clothing-items');
      if (!response.ok) {
        throw new Error('Failed to fetch clothing items');
      }
      const data = await response.json();
      setClothingItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error fetching clothing items:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterData(e.target.value);
  };

  const filterData = (query) => {
    const filtered = clothingItems.filter((item) =>
      item.productName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleRating = async (itemId, rating) => {
    try {
      const response = await fetch(`/api/auth/clothing-items/${itemId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      const updatedItem = await response.json();
      setClothingItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="financial-home">
      {/* Hero Section */}
      <div className="hero">
        <h1>"One App, Millions of Opinions-Find Your Perfect Assistant!"</h1>
        <p>"Rate Today, Transform Tomorrow's Assistance!"</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder=""
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Clothing Items Section */}
      <div className="items-list">
        {filteredItems.map((item) => (
          <div className="item-card" key={item.id}>
            <img src={item.imageUrl} alt={item.productName} />
            <h3>{item.productName}</h3>
            <p>{item.description}</p>

            {/* Display Star Ratings */}
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${item.rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRating(item.id, star)}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="rating-text">Rating: {item.rating || 'Not rated yet'}</p>

            {/* Reviews Section */}
            <div className="review-section">
              <h4>Recent Reviews:</h4>
              {item.reviews && item.reviews.length > 0 ? (
                <ul>
                  {item.reviews.slice(0, 3).map((review, index) => (
                    <li key={index} className="review">
                      "{review.comment}" - <strong>{review.user}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* View Details Button */}
            <Link to={`/item/${item.id}`} className="view-details">
              View Details & Review
            </Link>
          </div>
        ))}
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2>Join SeraniLux</h2>
        <p>Sign up and share your experiences with others!</p>
        <button className="cta-button">
          <Link to="/sign-up">Sign Up</Link>
        </button>
      </div>
    </div>
  );
}
