"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const server_1 = require("./server");
const net_1 = __importDefault(require("net"));
// Fonction pour trouver un port libre
function getAvailablePort(start = 10001) {
    return new Promise((resolve, reject) => {
        const server = net_1.default.createServer();
        server.listen(start, () => {
            const address = server.address();
            const port = typeof address === "string" ? start : address?.port || start;
            server.close(() => resolve(port));
        });
        server.on("error", () => {
            getAvailablePort(start + 1)
                .then(resolve)
                .catch(reject);
        });
    });
}
// Démarrage avec port dynamique
(async () => {
    try {
        const port = Number(process.env.API_PORT) || (await getAvailablePort());
        const app = (0, server_1.createServer)();
        app.listen(port, () => {
            console.log(`✅ API listening on :${port}`);
            console.log(`🔗 URL de l'API: http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Erreur lors du démarrage:", error);
    }
})();
