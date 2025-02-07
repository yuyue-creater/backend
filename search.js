class DictionarySearch {
    constructor() {
        this.searchInput = document.getElementById("searchWord");
        this.searchButton = document.getElementById("search");
        this.resultBox = document.getElementById("result");

        // Bind the event listener to the class method
        this.searchButton.addEventListener("click", () => this.handleSearch());
    }

    // Validate the input
    validateInput(word) {
        if (!word || /\d/.test(word)) {
            return "Invalid input! Please enter a valid word.";
        }
        return null;
    }

    // Fetch the word definition from the server
    async fetchDefinition(word) {
        try {
            const response = await fetch(`https://backendtest-8ivf.onrender.com/api/definitions?word=${word}`);
            console.log("Response status:", response.status); // Log status code
            const data = await response.json();
            console.log("Parsed JSON:", data); // Log the parsed response
            return data;
        } catch (error) {
            console.error("Fetch error:", error); // Log fetch errors
            return null;
        }
    }

    // Handle the search action
    async handleSearch() {
        const word = this.searchInput.value.trim();

        const validationError = this.validateInput(word);
        if (validationError) {
            this.resultBox.innerText = validationError;
            return;
        }

        const data = await this.fetchDefinition(word);
        if (data) {
            if (data.entry) {
                this.resultBox.innerText = `${data.entry.word}: ${data.entry.definition} (Request #${data.requestCount})`;
            } else {
                this.resultBox.innerText = `Request #${data.requestCount}: Word '${word}' not found!`;
            }
        } else {
            this.resultBox.innerText = "Error: Could not connect to the server.";
        }
    }
}

// Initialize the DictionarySearch class
document.addEventListener("DOMContentLoaded", () => {
    new DictionarySearch();
});
