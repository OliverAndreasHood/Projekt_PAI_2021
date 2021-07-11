// Just a helper function to return provided strings in first letters capitalized form

import React from 'react';

const Capitalize = (str) => {
    try{
        return str && str !== "" && str !== null ? str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        ) : "";
    }catch(error){
        return str;
    }
} 

export default Capitalize;