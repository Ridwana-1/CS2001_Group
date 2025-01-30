import { useState } from 'react'
import './App.css'


import { Search } from './components/Search';




function App() {
  

  return (
    <div className="App"> 
     <div className="SearchBar">
    <Search />
     <div>SearchResults</div>
     </div>


    </div>
  
    

);
  }

export default App
