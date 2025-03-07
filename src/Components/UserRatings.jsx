import React, { useState } from 'react';
import './UserRatings.css';  // Import the CSS file for styling

const UserRatings = ({ onRate }) => {
  const [selectedRating, setSelectedRating] = useState(0);  // State to track the selected rating
  const [comment, setComment] = useState('');  // State to track the comment

  const handleStarClick = (rating) => {
    setSelectedRating(rating);  // Update the selected rating when a star is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRating > 0) {
      onRate(selectedRating, comment);  // Pass the rating and comment to the parent component
      setSelectedRating(0);  // Reset the rating after submission
      setComment('');  // Reset the comment after submission
    }
  };

  return (
    <div className="user-ratings-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= selectedRating ? 'selected' : ''}`}
            onClick={() => handleStarClick(star)} // Add click handler for stars
          >
            &#9733;
          </span>
        ))}
      </div>

      <textarea
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}  // Handle comment change
        className="comment-input"
      />

      <button onClick={handleSubmit} className="submit-rating-btn">
        Submit Rating
      </button>
    </div>
  );
};

export default UserRatings;
