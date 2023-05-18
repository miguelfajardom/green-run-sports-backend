<h1>GreenRun - Sports Backend API</h1>
  <p>This repository contains the backend API for the GreenRun Sports application, a sportsbook platform that offers bets on various sports. The API is built using Node.js and TypeScript and utilizes a relational MySQL database for data storage. It provides endpoints for user registration, authentication, managing user roles, placing bets, managing transactions, and administrative operations.</p>
  <h2>Prerequisites</h2>
  <p>To run the GreenRun - Sports backend API locally, you need to have the following software installed on your machine:</p>
  <ul>
    <li>Node.js (version 14 or later)</li>
    <li>MySQL database</li>
  </ul>
  <h2>Getting Started</h2>
  <ol>
    <li>Clone this repository to your local machine:</li>
    <pre><code>git clone https://github.com/miguelfajardom/green-run-sports-backend.git</code></pre>
    <li>Install the dependencies:</li>
    <pre><code>npm install</code></pre>
    <li>Set up the MySQL database and configure the connection settings in the `.env` file.</li>
    <li>Run the database migrations to create the necessary tables:</li>
    <pre><code>npm run migrate</code></pre>
    <li>Start the server:</li>
    <pre><code>npm run start:dev</code></pre>
    <li>The API will be accessible at <a href="http://ec2-18-221-215-222.us-east-2.compute.amazonaws.com:3000/api">http://ec2-18-221-215-222.us-east-2.compute.amazonaws.com:3000/</a>.</li>
  </ol>
  <h2>API Documentation</h2>
  <p>You can find the Swagger documentation for the GreenRun - Sports backend API at <a href="http://ec2-18-221-215-222.us-east-2.compute.amazonaws.com:3000/api-docs">Swagger Docs</a>.</p>
  <p>The documentation provides details about the available endpoints, request/response formats, and authentication requirements. You can use the Swagger UI to interact with the API and test the different functionalities.</p>
  <h2>Deployment</h2>
  <p>The GreenRun - Sports backend API can be deployed to any cloud service provider like AWS, GCP, or Azure. To deploy the application, follow these general steps:</p>
  <ol>
    <li>Provision a virtual machine or server instance on your preferred cloud provider.</li>
    <li>Set up the necessary environment variables (such as database connection settings) on the server.</li>
    <li>Copy the project files to the server.</li>
    <li>Install the dependencies:</li>
    <pre><code>npm install --production</code></pre>
    <li>Build the project:</li>
    <pre><code>npm run build</code></pre>
    <li>Start the server:</li>
    <pre><code>npm run start</code></pre>
    <li>The API will be accessible at the appropriate server URL.</li>
  </ol>
  <p>Note: Make sure to configure any necessary security measures, such as firewalls and SSL certificates, for your deployed API.</p>