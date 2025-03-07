import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './Components/Navbar.js';
import Home from './pages/Home/Home.js';
import Transactions from './pages/Transactions/Transaction.jsx';
import UserProfile from './pages/UserProfile/UserProfile';  // Import UserProfile

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/explore" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/user-profile" element={<UserProfile />} /> {/* Add Route for UserProfile */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';

// import Navbar from './Components/Navbar.js';
// import Home from './pages/Home/Home.js';
// import Transactions from './pages/Transactions/Transaction.jsx';
// import UserProfile from './pages/UserProfile/UserProfile';  // Import UserProfile

// function App() {
//   return (
//     <Router>
//       <div>
//         <Navbar />
//         <Routes>
//           <Route path="/explore" element={<Home />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/user-profile" element={<UserProfile />} /> {/* Add Route for UserProfile */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import './App.css';

// // import Navbar from './Components/Navbar.js';
// // import Home from './pages/Home/Home.js';
// // import Transactions from './pages/Transactions/Transaction.jsx';

// // function App() {
// //   return (
// //     <Router>
// //       <div>
// //         <Navbar />
// //         <Routes>
// //           <Route path="/explore" element={<Home />} />
// //           <Route path="/transactions" element={<Transactions />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
