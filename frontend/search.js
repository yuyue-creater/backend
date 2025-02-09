const searchbar = document.getElementById("searchbar");
const wordLabel = document.getElementById("word");
const definitionLabel = document.getElementById("definition");

// Populate texts
Utils.setText("title", searchText);
Utils.setValue("submit", searchText);

document.getElementById("submit").addEventListener("click", async (event) => {
    // Stop page from refreshing
    event.preventDefault();

    const word = searchbar.value;
    if (!Utils.isValid(word)) {
        definitionLabel.innerHTML = invalidWordText;
        return;
    }
    Utils.clearElements(wordLabel, definitionLabel);

    const result = await Utils.search(word);
    if (result) {
        wordLabel.innerHTML = word;
        definitionLabel.innerHTML = result.message;

    } else definitionLabel.innerHTML = searchErrorText;
});