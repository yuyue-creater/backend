const searchbar = document.getElementById("searchbar");
const wordLabel = document.getElementById("word");
const definitionLabel = document.getElementById("definition");

document.getElementById("submit").addEventListener("click", async (event) => {
    // Stop page from refreshing
    event.preventDefault();

    const word = searchbar.value;
    if (!Utils.isValid(word)) {
        definitionLabel.innerHTML = "Search cannot be empty and cannot contain numbers";
        return;
    }
    Utils.clearElements(wordLabel, definitionLabel);

    const result = await Utils.search(word);
    if (result) {
        wordLabel.innerHTML = word;
        definitionLabel.innerHTML = result.message;

    } else definitionLabel.innerHTML = "An error occurred, could not retrieve data from server";
});