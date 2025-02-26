import React from 'react';

import { FaSearch } from 'react-icons/fa';
import "./Search.css";

export const Search = () => {
return (
    <div className= "input-wrapper">
<FaSearch id="Search-icon" />
<input placeholder="Explore" />
</div>


);
};