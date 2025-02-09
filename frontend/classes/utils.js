class Utils {

    static fetchLink = "http://localhost:8000/api/definitions/";
    
    static async search(word) {
        try {
            const response = await fetch(`${Utils.fetchLink}?word=${word}`);        
            const data = await response.json(); // parse JSON            
            return data;        
    
        } catch (e) {
            return null;
        }
    }

    static isValid(word) {
        if (word === "") return false;
        return !/\d/.test(word);
    }

    static clearElements(...elements) {
        elements.forEach(element => element.innerHTML = "");
    }
}