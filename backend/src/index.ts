import app from "./app.js";
import 'dotenv/config';

if (!process.env.PORT) {
    throw new Error("No PORT found in .env");
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
