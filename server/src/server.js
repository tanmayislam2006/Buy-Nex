const app = require("./app");
const { connectDB } = require("./config/db");
const port = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    const time = new Date().toLocaleTimeString();
    console.log(`🚀 Server is running on http://localhost:${port} at ${time}`);
  });
}

startServer().catch(console.dir);
