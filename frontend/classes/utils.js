class Utils {

    static fetchLink = "http://localhost:8000/api/definitions/";
    
    static setText(id, text) {
        document.getElementById(id).innerHTML = text;
    }

    static setValue(id, text) {
        document.getElementById(id).value = text;
    }

    static async search(word) {
        try {
            const response = await fetch(`${Utils.fetchLink}?word=${word}`);        
            const data = await response.json(); // parse JSON            
            return data;        
    
        } catch (e) {
            return null;
        }
    }

    static async post(word, definition, responseLabel) {
        try {
            // Set up XMLHttp request
            const xhr = new XMLHttpRequest();
            xhr.open("POST", Utils.fetchLink);
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

            // Set up what to do after response
            xhr.onload = () => {
                if (xhr.status !== 200) {
                    responseLabel.innerHTML = storeErrorText;
                    return;
                }
                // Set the response label
                const message = JSON.parse(xhr.response).message;
                if (message) responseLabel.innerHTML = message;
                else responseLabel.innerHTML = storeErrorText;
            }
            // Set up error handling
            xhr.timeout = 4000; // 5 seconds
            xhr.onerror = () => responseLabel.innerHTML = storeErrorText;

            xhr.send(JSON.stringify({ word: word, definition: definition }));

        } catch (e) {
            responseLabel.innerHTML = `${generalErrorText}${e}`;
        }
    }

    static isValid(word) {
        if (word.trim() === "") return false;
        return !/\d/.test(word);
    }

    static clearElements(...elements) {
        elements.forEach(element => element.innerHTML = "");
    }
}