class DefinitionManager {
    constructor() {
        this.wordInput = document.getElementById("word");
        this.definitionInput = document.getElementById("definition");
        this.submitButton = document.getElementById("submit");
        this.messageBox = document.getElementById("message");

        // Bind the event listener to the class method
        this.submitButton.addEventListener("click", () => this.handleSubmit());
    }

    // Validate input
    validateInput(word, definition) {
        if (!word || !definition || /\d/.test(word)) {
            return "Invalid input! Please enter a valid word and definition.";
        }
        return null;
    }

    // Send the definition to the server
    async sendDefinition(word, definition) {
        try {
            const response = await fetch("https://backendtest-8ivf.onrender.com/api/definitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word, definition })
            });
            const data = await response.json();
            return data.message;
        } catch (error) {
            return "Error: Could not connect to the server.";
        }
    }

    // Handle the submit action
    async handleSubmit() {
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();

        const validationError = this.validateInput(word, definition);
        if (validationError) {
            this.messageBox.innerText = validationError;
            return;
        }

        const message = await this.sendDefinition(word, definition);
        this.messageBox.innerText = message;
    }
}

// Initialize the DefinitionManager class
document.addEventListener("DOMContentLoaded", () => {
    new DefinitionManager();
});
