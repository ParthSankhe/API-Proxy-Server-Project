const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create a cache instance
const cache = new NodeCache({ stdTTL: process.env.CACHE_DURATION / 1000 });

// Set up logging
const logger = winston.createLogger({
   level: 'info',
   format: winston.format.json(),
   transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'requests.log' })
   ],
});

// Rate limiting
const limiter = rateLimit({
   windowMs: 60 * 1000, // 1 minute
   max: process.env.RATE_LIMIT || 5, // Limit each IP to 5 requests per windowMs
   handler: (req, res) => {
      res.status(429).json({ error: 'Rate limit exceeded' });
   }
});

app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    const rateLimitStatus = res.getHeader('X-RateLimit-Remaining') || 'Not set'; // Get rate limit status
    logger.info({ timestamp, ip, rateLimitStatus }); // Log with rate limit status
    next();
 });
 
// Proxy route with basic authentication
app.get('/proxy', (req, res, next) => {
   // Basic authentication check
   const apiKey = req.query.apiKey || req.headers['api-key'];

   if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
   }

   next();
}, async (req, res) => {
   const cacheKey = 'external_api_response';
   const cachedResponse = cache.get(cacheKey);

   // Check if response is cached
   if (cachedResponse) {
      console.log('Serving from cache'); // Log when serving from cache
      return res.json(cachedResponse);
   }

   try {
      // Make the API request (replace this with any public API of your choice)
      const response = await axios.get('https://api.github.com');

      // Cache the response
      cache.set(cacheKey, response.data);

      console.log('Serving from API'); // Log when serving from API
      // Return the response to the client
      res.json(response.data);
   } catch (error) {
      res.status(500).json({ error: 'Error fetching data from the external API' });
   }
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
   console.log('API Key:', process.env.API_KEY);
});
