require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
    port: process.env.PORT || 3000,
    openaiApiKey: process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL) || 3600
    }
}; 