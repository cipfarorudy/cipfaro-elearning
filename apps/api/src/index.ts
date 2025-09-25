import "dotenv/config";
import { createServer } from "./server";
import net from "net";

// Fonction pour trouver un port libre
function getAvailablePort(start = 10001): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

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
    const app = createServer();
    app.listen(port, () => {
      console.log(`✅ API listening on :${port}`);
      console.log(`🔗 URL de l'API: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage:", error);
  }
})();
