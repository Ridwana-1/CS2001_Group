import React, { useState, useRef } from 'react';
import product1 from '../../assets/product1.jpg';
import product2 from '../../assets/product2.jpg';
import product3 from '../../assets/product3.jpg';
import product4 from '../../assets/product4.jpg';
import './shop.css'; // Make sure this path is correct

const Shop = () => {
  // Sample food data with your actual product images
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      cuisine: "Italian",
      price: "$12",
      image: product1
    },
    {
      id: 2,
      name: "Beef Bulgogi",
      description: "Marinated beef with rice and vegetables",
      cuisine: "Korean",
      price: "$15",
      image: product2
    },
    {
      id: 3,
      name: "Chicken Tikka Masala",
      description: "Spiced chicken in a rich tomato cream sauce",
      cuisine: "Indian",
      price: "$14",
      image: product3
    },
    {
      id: 4,
      name: "Avocado Toast",
      description: "Sourdough bread with smashed avocado and poached egg",
      cuisine: "Brunch",
      price: "$10",
      image: product4
    },
    {
      id: 5,
      name: "Salmon Poke Bowl",
      description: "Fresh salmon with rice, vegetables, and soy dressing",
      cuisine: "Hawaiian",
      price: "$16",
      image: product1 // Reusing the first image for the fifth item
    }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [savedFoods, setSavedFoods] = useState([]);
  const [passedFoods, setPassedFoods] = useState([]);
  const [swipeInProgress, setSwipeInProgress] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef(null);
  
  // Handle the start of a drag
  const handleTouchStart = (e) => {
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setSwipeInProgress(true);
  };
  
  // Handle the drag movement
  const handleTouchMove = (e) => {
    if (!swipeInProgress || !cardRef.current) return;
    
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;
    
    // Rotate slightly for a more natural feel
    const rotate = deltaX * 0.1;
    
    // Apply transformation
    cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    
    // Update the visual direction indicator
    if (deltaX > 50) {
      setSwipeDirection('right');
    } else if (deltaX < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };
  
  // Handle the end of a drag
  const handleTouchEnd = () => {
    if (!swipeInProgress || !cardRef.current) return;
    
    // Reset state
    setSwipeInProgress(false);
    
    // Get current transformation
    const style = window.getComputedStyle(cardRef.current);
    const transform = style.getPropertyValue('transform');
    const matrix = new DOMMatrix(transform);
    const deltaX = matrix.m41; // The X translation
    
    // If moved enough, consider it a swipe
    if (deltaX > 100) {
      handleSwipeRight();
    } else if (deltaX < -100) {
      handleSwipeLeft();
    } else {
      // Reset card position with animation
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.transition = '';
      }, 300);
    }
    
    setSwipeDirection(null);
  };
  
  // Handle swipe right (save food)
  const handleSwipeRight = () => {
    if (currentIndex >= foodItems.length) return;
    
    const food = foodItems[currentIndex];
    setSavedFoods(prev => [...prev, food]);
    
    // Animate card off screen
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s ease';
      cardRef.current.style.transform = 'translateX(1000px) rotate(30deg)';
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        if (cardRef.current) {
          cardRef.current.style.transition = '';
          cardRef.current.style.transform = '';
        }
      }, 500);
    }
  };
  
  // Handle swipe left (pass food)
  const handleSwipeLeft = () => {
    if (currentIndex >= foodItems.length) return;
    
    const food = foodItems[currentIndex];
    setPassedFoods(prev => [...prev, food]);
    
    // Animate card off screen
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s ease';
      cardRef.current.style.transform = 'translateX(-1000px) rotate(-30deg)';
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        if (cardRef.current) {
          cardRef.current.style.transition = '';
          cardRef.current.style.transform = '';
        }
      }, 500);
    }
  };
  
  // Button handlers
  const handleLikeClick = () => {
    if (!swipeInProgress) handleSwipeRight();
  };
  
  const handlePassClick = () => {
    if (!swipeInProgress) handleSwipeLeft();
  };
  
  // Reset all food items
  const handleReset = () => {
    setCurrentIndex(0);
    setSavedFoods([]);
    setPassedFoods([]);
  };
  
  // Render current food card
  const renderFoodCard = () => {
    if (currentIndex >= foodItems.length) {
      return (
        <div className="empty-state">
          <h2 className="empty-title">No more food items!</h2>
          <p className="empty-message">You've gone through all available options.</p>
          <button 
            className="restart-button"
            onClick={handleReset}
          >
            Start Over
          </button>
        </div>
      );
    }
    
    const food = foodItems[currentIndex];
    
    return (
      <div
        ref={cardRef}
        className={`food-card ${swipeDirection === 'right' ? 'swiping-right' : ''} ${swipeDirection === 'left' ? 'swiping-left' : ''}`}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="swipe-indicator save">SAVE</div>
        <div className="swipe-indicator pass">PASS</div>
        
        <img 
          src={food.image} 
          alt={food.name} 
          className="food-image"
        />
        
        <div className="food-info">
          <div className="food-header">
            <h2 className="food-name">{food.name}</h2>
            <span className="food-price">{food.price}</span>
          </div>
          <p className="food-cuisine">Cuisine: {food.cuisine}</p>
          <p className="food-description">{food.description}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="swipe-container">
      <h1 className="app-title">Food Finder</h1>
      
      <div className="card-container">
        {renderFoodCard()}
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={handlePassClick}
          className="action-button pass-button"
          disabled={currentIndex >= foodItems.length}
        >
          ✕
        </button>
        
        <button 
          onClick={handleLikeClick}
          className="action-button save-button"
          disabled={currentIndex >= foodItems.length}
        >
          ♥
        </button>
      </div>
      
      <div className="saved-section">
        <h2 className="saved-title">Saved Foods</h2>
        {savedFoods.length > 0 ? (
          <div className="saved-tags">
            {savedFoods.map(food => (
              <div key={food.id} className="saved-tag">
                {food.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-saved">No saved foods yet.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;