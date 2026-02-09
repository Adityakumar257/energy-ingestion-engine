const { loadEnv } = require("./config/env");
loadEnv();

const app = require("./app");
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
