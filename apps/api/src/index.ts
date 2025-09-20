import "dotenv/config";
import { createServer } from "./server";

const port = Number(process.env.API_PORT || 3001);
const app = createServer();
app.listen(port, () => console.log(`✅ API listening on :${port}`));
