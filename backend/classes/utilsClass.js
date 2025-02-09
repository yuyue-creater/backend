class Utils {
    
    static writeCORSHead(res, contentType) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", contentType);
    }

    static async parseBody(req) {
        return new Promise((res) => {
            let body = "";
            req.on("data",  chunk => body += chunk);
            req.on("end", () => res(JSON.parse(body)));
        });
    }

    static isValidWord(word) {
        if (word.trim() === "") return false;
        return !/\d/.test(word);
    }

    static getCurrentDate() {
        return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    }
}

exports.Utils = Utils;