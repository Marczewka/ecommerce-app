import "./loadEnv.js";
import app from "./app.js";

if (!process.env.PORT) {
    throw new Error("No PORT found in .env");
}

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
    if (NODE_ENV === "development") {
        console.log(`Listening on http://localhost:${PORT}`);
    }
});
