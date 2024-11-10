import React, { useState, useEffect } from 'react';
import './App.css';

// List of logos or items to loop through
const items = [
  '🦑', // Squid
  '💣', // Bomb
  '⚡', // Lightning Bolt
];

const MysteryBox = ({ onItemClick }) => {
    const [currentItem, setCurrentItem] = useState(null); // The item displayed in the circle
    const [isRolling, setIsRolling] = useState(false);     // Controls the rolling animation
    const [timeoutId, setTimeoutId] = useState(null);       // Stores the timeout ID to reset roll
  
    // Function to start the rolling animation
    const startRolling = () => {
      setIsRolling(true);
      const interval = setInterval(() => {
        // Cycle through items randomly
        const randomIndex = Math.floor(Math.random() * items.length);
        setCurrentItem(items[randomIndex]);
      }, 100); // Change item every 100ms for a fast loop effect
  
      // Stop rolling after a random duration
      setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * items.length);
        setCurrentItem(items[randomIndex]); // Set to final item
        setIsRolling(false);
      }, 3000); // Stop after 3 seconds
    };
  
    // Handle item click to perform an action and reset
    const handleClick = () => {
      if (!isRolling && currentItem) {
        onItemClick(currentItem);      // Call the provided function with the selected item
        setCurrentItem(null);          // Clear the circle
  
        // Set a new timer to reroll after 120 seconds
        if (timeoutId) clearTimeout(timeoutId); // Clear previous timeout if any
        const newTimeoutId = setTimeout(() => {
          startRolling(); // Start rolling again after 120 seconds
        }, 120000); // 120 seconds (120000ms)
        setTimeoutId(newTimeoutId);
      }
    };
  
    useEffect(() => {
      // Start rolling immediately on mount
      startRolling();
  
      // Cleanup when the component unmounts
      return () => {
        if (timeoutId) clearTimeout(timeoutId); // Clear timeout on unmount
      };
    }, []);
  
    return (
      <div onClick={handleClick} style={{
        alignSelf:'flex-end',
        width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #000',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
        cursor: isRolling ? 'not-allowed' : 'pointer', background: '#f3f3f3', position: 'fixed', zIndex: 9998,
        right: '15%',  /* Ensures it overlays all app content */
        bottom: '75%', /* Ensures it overlays all app content */
      }}>
        {currentItem || "?"} {/* Display item or placeholder */}
      </div>
    );
  };

  export default MysteryBox;