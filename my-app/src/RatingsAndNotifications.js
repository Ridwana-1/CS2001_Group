import { useState, useEffect } from "react";
import axios from "axios";

const RatingsAndNotifications = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [userRatings, setUserRatings] = useState([]);

    useEffect(() => {
        axios.get(`/api/ratings/1`).then(res => setUserRatings(res.data));
    }, []);

    const submitRating = async () => {
        await axios.post("/api/ratings/submit", { ratedUserId: 1, rating, feedback });
        alert("Rating submitted!");
    };

    return (
        <div className="ratings-container">
            <h3>Rate User</h3>
            <input 
                type="number" 
                min="1" 
                max="5" 
                value={rating} 
                onChange={e => setRating(e.target.value)}
            />
            <textarea 
                value={feedback} 
                onChange={e => setFeedback(e.target.value)}
                placeholder="Leave feedback..."
            />
            <button onClick={submitRating}>Submit Rating</button>

            <h3>User Reviews</h3>
            {userRatings.length === 0 ? <p>No reviews yet</p> : (
                userRatings.map((r, index) => (
                    <div key={index}>
                        <p><strong>⭐ {r.rating}</strong></p>
                        <p>{r.feedback}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default RatingsAndNotifications;
