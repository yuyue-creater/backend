// const fetchLink = "localhost:3000/api/definitions/";
const fetchLink = "https://backendtest-8ivf.onrender.com/api/definitions/";

// Helper funnctions
const search = async function(word) {
    try {
        const response = await fetch(`${fetchLink}?word=${word}`);        
        const data = await response.json(); // parse JSON            
        return data;        

    } catch (e) {
        return null;
    }
}

const isValidSearch = function(word) {
    if (word === "") return false;
    // parseFloat will return NaN if string contains only letters
    return isNaN(parseFloat(word));
}

// Add event listeners
document.getElementById("submit").addEventListener("click", async function(event) {
    // Stop from refreshing page
    event.preventDefault();
    
    // Get word from search bar
    const word = document.getElementById("searchbar").value;
    
    // Clear previous search
    document.getElementById("word").innerText = "";
    document.getElementById("definition").innerText = "";

    // Check if input is valid
    if (!isValidSearch(word)) {
        document.getElementById("definition").innerText = "Search cannot be empty and must not contain numbers";
        return;
    }
    
    // Do the search
    const result = await search(word);        
    if (result) {
        document.getElementById("word").innerText = word;
        document.getElementById("definition").innerText = result.message;

    } else {
        // Fetch failed to get a definition
        document.getElementById("word").innerText = "An error has occurred";
        document.getElementById("definition").innerText = "Something went wrong trying to get data from server";
    }
});