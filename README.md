# zomato_listing_searching_restapi
 
## Key Use Cases
 
### go to terminal run -npm start to run in local machine
### go to url -http://localhost:3000/index.html
### go to url -http://localhost:3000/restaurant.html?id=3995

### Data Loading
Create an independent script to load the Zomato restaurant data available [here](https://www.kaggle.com/datasets/shrutimehta/zomato-restaurants-data) into a database.
 

### REST API Service -REST api architecture 
Developed a rest API service with the following endpoints to serve the content loaded in the previous step:
  - **Get Restaurant by ID**: Retrieve details of a specific restaurant by its ID.
  - **Get List of Restaurants**: Fetch a list of restaurants with pagination support.
 

### User Interface
Develop a web application with the following pages, which must connect to the web API service:
  - **Restaurant List Page**: Display a list of restaurants. Clicking on a restaurant should navigate the user to the restaurant's detail page.
  - **Restaurant Detail Page**: Show details of a specific restaurant.
  - **Filtering Options**:
     - By Country
     - By Average Spend for Two People
     - By Cuisines
  - **Search Functionality**: Enable search for restaurants by name and description.