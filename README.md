## Down load the project

In the commond prompt do git clone 'Repository URL'

## Available Scripts

In the project directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Description

This Stock Application is an open source inventory software which can be used for Small and Mid sized business.
This application can be accessd through web browsers and It shows the list of products, list of articles stock and list of products stock.This application provided a feasibility to upload Producs/Articles information from Excel sheet.

### Bascis Features

1)Product inventory details can be uploaded from Excel

2)Article inventory details can be uploaded from Excel/Quantity can be updated through application

3)Have features to seel the product

4)Shows "Out of stock" product information

### Before move to production

Product URI and Article URI are hard coded. That needs to be removed.

Middleware and DB connection needs to be implemented accordingly.

### Improvements

Need to implement pagination as Products and Articles grows, it will lead the performance issue.

Filter options need to implement which will narrow down the results and user can get the exact information.

Currency should be picked based the country.

Show the list of avilable products based on the inventory stock.
