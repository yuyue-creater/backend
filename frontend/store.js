const responseLabel = document.getElementById("response");
const wordField = document.getElementById("word");
const definitionField = document.getElementById("definition");

document.getElementById("submit").addEventListener("click", async (event) => {
    // Stop page from refreshing
    event.preventDefault();

    const word = wordField.value;
    const definition = definitionField.value;
    if (!Utils.isValid(word)) {
        responseLabel.innerHTML = "Word cannot be empty and cannot contain numbers";
        return;
    }
    Utils.clearElements(responseLabel);

    const result = await Utils.post(word, definition);
    if (result) responseLabel.innerHTML = result.message;
    else responseLabel.innerHTML = "An error occurred, could not store definition to server";
});