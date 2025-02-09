const responseLabel = document.getElementById("response");
const wordField = document.getElementById("word");
const definitionField = document.getElementById("definition");

// Populate texts
Utils.setText("title", storeText);
Utils.setText("word-label", wordText);
Utils.setText("definition-label", definitionText);
Utils.setValue("submit", addWordText);

document.getElementById("submit").addEventListener("click", async (event) => {
    // Stop page from refreshing
    event.preventDefault();

    const word = wordField.value;
    const definition = definitionField.value;
    if (!Utils.isValid(word)) {
        responseLabel.innerHTML = invalidWordText;
        return;
    }
    Utils.clearElements(responseLabel);
    Utils.post(word, definition, responseLabel); // Will set the response label
});