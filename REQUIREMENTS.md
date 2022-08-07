# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

`The best way to run project, below`

#### Users

-   Create (args: User)[token required]: `'/api/users/' [POST] (token_requied)`
-   Index [token required]: `'/api/users/' [GET] (token_requied)`
-   Show [token required]: `'/api/users/:id' [GET] (token_requied)`

#### Category

-   Create (args: Category)[token required]: `'/api/categories/' [POST] (token_requied)`
-   Index [token required]: `'/api/categories/' [GET] (token_requied)`

#### Products

-   Create (args: Product)[token required]: `'/api/products' [POST] (token_required)`
-   Index: `'/api/products' [GET]`
-   Show: `'/api/products/:id' [GET]`
-   [OPTIONAL] Top 5 most popular products
-   [OPTIONAL] Products by category: `'/api/products/category/category_id' [GET]`

#### Orders

-   Current Order by user [token required]: `'/api/orders/active' => get userId from token [GET] (token_requied)`

-   [ADDED] Update order's status [token required]: `'/api/orders' => get userId from token [PUT] (token_requied)`

-   [OPTIONAL] Completed Orders by user [token required]: `'/api/orders/compelate' => get userId from token [GET] (token_requied)`

## Data Shapes

#### User

-   id
-   first_name
-   last_name
-   password

```

Table: users(
id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50),
password VARCHAR(200) NOT NULL
)

```


#### Category

-   id
-   name

```

Table: categories(
id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
name VARCHAR(50) NOT NULL
)

```

#### Product

-   id
-   name
-   price
-   [OPTIONAL] category_id

```

Table: products(
id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
name VARCHAR(50) NOT NULL,
price NUMERIC NOT NULL,
category_id uuid REFERENCES categories(id) ON DELETE CASCADE
)
```

#### Orders

-   id
-   status
-   user_id
-   total

```
Table: orders(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    status statusOfOrder DEFAULT 'active',
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    total NUMERIC NOT NULL
)
```

#### Products_Orders (ManyToMany Relation)

-   id
-   order_id
-   product_id
-   quantity

```
Table: products_orders(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL
)
```
