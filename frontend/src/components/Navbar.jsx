import { useState, useEffect } from 'react';

function Navbar({ onLogout }) {
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="navbar">
      <div className="greeting">{greeting}, User</div>
      <div className="navbar-actions">
        <input type="text" placeholder="Search..." />
        <button className="create-new">Create New</button>
        <div className="user-profile">
          <button className="user-initials" onClick={onLogout}>SU</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
