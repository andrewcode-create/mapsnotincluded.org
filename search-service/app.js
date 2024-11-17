require("dotenv").config();

const discord = require("./lib/discord");
//const discord = null;

const mongo = require("./lib/mongo");
const sequelize = require("./lib/database");
//const { Save, File } = require('./models');
//const discord = require('./lib/discord');

const express = require("express");
const cors = require("cors");

const app = express();

const allowedDomains = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",")
  : [];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed domains array
      if (allowedDomains.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json({ limit: "100mb" })); // Change '100mb' to the desired limit
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static("public")); // TODO: Host UI from here perhaps?

const port = process.env.PORT || 3000;
const interface = process.env.INTERFACE || "localhost";
const apiPrefix = process.env.API_PREFIX || "";

app.use((req, res, next) => {
  // TODO: Proper logging
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get(`${apiPrefix}`, (req, res) => {
  res.json({
    message: "Welcome to the MapsNotIncluded API",
  });
});

app.use(`${apiPrefix}/login`, require("./controllers/Login"));
app.use(`${apiPrefix}/coordinates`, require("./controllers/Coordinates"));
//app.use(`${apiPrefix}/saves`, require('./controllers/Save'));
//app.use(`${apiPrefix}/files`, require('./controllers/File'));
//app.use(`${apiPrefix}/ingest`, require('./controllers/Ingest'));

app.use(`${apiPrefix}/search`, require("./controllers/Search"));

app.use(`${apiPrefix}/upload`, require("./controllers/Upload"));

// for help in development - only runs locally
if (interface === "localhost") {
  app.use((req, res, next) => {
    res.json({
      message: "Unrecognized URL.",
    });
    console.log(`Unrecognized: ${req.method} ${req.url}`);
    next();
  });
}

app.use((err, req, res, next) => {
  console.log(`biq Error: ${err}`);
  console.error(err.stack);
  console.log(err.message);

  discord.send(
    `[${req.method}] ${req.url} Error: ${err}\r\n\r\n \`\`\`${err.stack}\`\`\``
  );

  res.status(500).json({
    error: "Something broke!",
  });
});

mongo
  .connect()
  .then(() => {
    app.listen(port, interface, () => {
      console.log(
        `Server is running on port http://${interface}:${port} with prefix ${apiPrefix}`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:");
    console.error(err);
    try {
      discord.send(`MongoDB connection error: ${err}`);
    } catch {
      console.log("DISCORD WEBHOOK ERROR");
      app.listen(port, interface, () => {
        console.log(
          `Server is running on port http://${interface}:${port} with prefix ${apiPrefix}`
        );
      });
    }
  });
