import React, { useState } from 'react';
import UserRatings from '../../Components/UserRatings';  // Import the UserRatings component
import './UserProfile.css'; // Import the CSS file for styling

const UserProfile = () => {
  const user = { name: 'User' };  // Example user, this could be dynamic from API

  const [ratings, setRatings] = useState([]);
  const [trustScore, setTrustScore] = useState(0);

  const handleRatingSubmission = (rating, comment) => {
    const newRating = { rating, comment };
    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);

    const totalRatings = updatedRatings.length;
    const totalScore = updatedRatings.reduce((acc, curr) => acc + curr.rating, 0);
    setTrustScore(totalScore / totalRatings);
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h2>{user.name}'s Profile</h2>
        <p>Check out the user's trust score and ratings!</p>
      </div>

      <div className="trust-score-container">
        <div className="trust-score-title">Trust Score</div>
        <div className="trust-score-value">{trustScore.toFixed(1)}</div>
      </div>

      <div className="ratings-container">
        <h3>User Ratings & Reviews</h3>
        <div>
          {ratings.length === 0 ? (
            <p className="no-reviews-text">No reviews yet. Be the first to rate!</p>
          ) : (
            ratings.map((review, index) => (
              <div key={index} className="rating-item">
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-${star <= review.rating ? 'yellow' : 'gray'}-500`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="comment-text">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="submit-rating-container">
        <UserRatings onRate={handleRatingSubmission} />
      </div>
    </div>
  );
};

export default UserProfile;
