const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`Origin ${origin} is not allowed by CORS`)
    );
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;