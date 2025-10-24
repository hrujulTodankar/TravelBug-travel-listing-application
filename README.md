# MajorProject

A travel listing application built with Node.js, Express, MongoDB, and EJS.

## Features

- View travel listings
- Add new listings
- Edit existing listings
- Delete listings
- Add reviews to listings

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating engine, Bootstrap
- **Other**: Method-Override for HTTP methods

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd majorproject
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB locally (assuming MongoDB is installed).

4. Run the application:
   ```
   node app.js
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Project Structure

- `app.js`: Main application file
- `models/`: Mongoose models for Listing and Review
- `views/`: EJS templates
- `public/`: Static assets (CSS, JS)
- `utils/`: Utility functions for error handling and async wrapping

## Routes

- `GET /`: Root route
- `GET /listings`: View all listings
- `GET /listings/new`: Form to add new listing
- `POST /listings`: Create new listing
- `GET /listings/:id`: View specific listing
- `GET /listings/:id/edit`: Form to edit listing
- `PUT /listings/:id`: Update listing
- `DELETE /listings/:id`: Delete listing
- `POST /listings/:id/reviews`: Add review to listing

## Dependencies

- express: ^5.1.0
- mongoose: ^8.18.1
- ejs: ^3.1.10
- ejs-mate: ^4.0.0
- method-override: ^3.0.0
- bootstrap: ^5.3.8