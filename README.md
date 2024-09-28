# Simple API Proxy Server

This project is a simple API proxy server built with Node.js and Express.js. It forwards requests to an external API, implements rate limiting, basic caching, and includes logging for every request. The project also features basic authentication and supports environment configuration for the rate limit and cache duration.

## Features

- **Proxy Server**: Forward requests to a public API.
- **Rate Limiting**: Limits each IP to 5 requests per minute (configurable).
- **Caching**: Caches API responses for 5 minutes (configurable).
- **Basic Authentication**: Requires an API key to access the proxy.
- **Logging**: Logs each request's timestamp and IP address.
- **Error Handling**: Graceful handling of errors from the external API.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Framework for building web applications.
- **Axios**: HTTP client for making requests to the external API.
- **Node-Cache**: In-memory caching solution.
- **Winston**: Logging library.
- **dotenv**: Loads environment variables.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or later)
- **npm** (Node package manager)

### Project Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ParthSankhe/API-Proxy-Server-Project.git
   cd API-Proxy-Server-Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project with the following content:
   ```bash
   API_KEY=dummy-api-key
   PORT=3000
   RATE_LIMIT=5
   CACHE_DURATION=300000
   ```

   - **API_KEY**: Replace `dummy-api-key` with your actual API key for authentication.
   - **PORT**: The port on which the server will run.
   - **RATE_LIMIT**: Maximum number of requests allowed per minute per IP.
   - **CACHE_DURATION**: Duration in milliseconds for which the API response is cached (default: 5 minutes).

4. Start the server:
   ```bash
   npm start
   ```

   You should see the message:
   ```
   Server is running on port 3000
   ```

## Usage

### Proxy Endpoint

- The proxy endpoint is `/proxy`.
- It forwards requests to a public API (in this case, GitHub API).
- The request requires an `api-key` header or query parameter for authentication.

#### Example Request in Postman

1. Set the URL to:
   ```
   http://localhost:3000/proxy
   ```
2. In the **Headers** tab, add a key `api-key` with the value `dummy-api-key` (or replace it with the actual key set in the `.env` file).
3. Send the request. If successful, you will receive the external API’s response.

#### Example Response
```json
{
   "current_user_url": "https://api.github.com/user",
   "current_user_authorizations_html_url": "https://github.com/settings/connections/applications{/client_id}",
   "authorizations_url": "https://api.github.com/authorizations"
   // More data from the GitHub API...
}
```

### Rate Limiting

- Each IP is limited to 5 requests per minute by default.
- If the limit is exceeded, a `429 Too Many Requests` response will be returned:
  ```json
  {
     "error": "Rate limit exceeded"
  }
  ```

### Caching

- Successful API responses are cached for 5 minutes (default).
- If a cached response is available, it will be served to reduce API load.

### Error Handling

- If there’s an error while fetching data from the external API, a `500 Internal Server Error` will be returned:
  ```json
  {
     "error": "Error fetching data from the external API"
  }
  ```

### Logs

- Each request is logged to both the console and `requests.log` file with the timestamp and IP address of the client.

#### Sample Log Entry
```json
{
   "level": "info",
   "message": {
      "ip": "::1",
      "timestamp": "2024-09-27T11:36:53.877Z"
   }
}
```

## Project Structure

```
├── node_modules/        # Project dependencies
├── .env                 # Environment variables (not included in Git)
├── .gitignore           # Files and directories to be ignored by Git
├── index.js             # Main server file
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lock file
├── README.md            # Project documentation
└── requests.log         # Log file generated by Winston
```

## Additional Notes

- You can modify the rate limit and cache duration by changing the values in the `.env` file.
- The server uses basic authentication. Ensure you pass the correct API key in your request headers or query parameters.
- The `node_modules` folder and sensitive files (like `.env`) are excluded from Git by the `.gitignore` file.

## Future Improvements

- Add support for more external APIs.
- Implement more robust authentication mechanisms.
- Provide options for customizing the proxy behavior via query parameters.

## License

This project is licensed under the MIT License.


