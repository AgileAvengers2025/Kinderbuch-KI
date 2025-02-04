## **API Documentation**

### **Base URL**
- The base URL for the API is `http://localhost:8082`.

---

### **Routes**

---

### 1. **Login Route**
#### **`POST /login`**

##### **Description:**
This route is used to log in to the API. It is required to access the protected routes. Upon successful login, the API will return an `accessToken` and a `refreshToken` will be issued for maintaining sessions.

##### **Request Body:**
- Currently not required.

##### **Response:**
- **Success:**
    ```json
    {
        "accessToken": "JWT_TOKEN",
        "refreshToken": "JWT_REFRESH_TOKEN"
    }
    ```
    - **accessToken**: A JWT (JSON Web Token) used for accessing protected routes.
    - **refreshToken**: A long-lived refresh token to refresh the access token when expired.

##### **Example:**
```bash
POST /login
```
Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkZyb250ZW5kIiwiaWF0IjoxNzM4NTc4NDYxLCJleHAiOjE3Mzg1ODIwNjF9.fixuFssDN3gypWYKMszywnUNckRQdRG9fdHmW8nPekg",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkZyb250ZW5kIiwiaWF0IjoxNzM4NTc4NDYxLCJleHAiOjE3Mzg2ODAwNjF9.ZykrrRtqACM0h3h1qLxfMnkgUm2Rk1hwiwRLm6gH0XY"
}
```

---

### 2. **Refresh Token Route**
#### **`POST /refresh-token`**

##### **Description:**
This route allows the client to refresh an expired `accessToken` using a valid `refreshToken` that was returned during login. The `refreshToken` must be included in the request body.

##### **Request Body:**
- **refreshToken**: The refresh token that was issued during login.

##### **Response:**
- **Success:**
    ```json
    {
        "accessToken": "NEW_JWT_TOKEN"
    }
    ```
    - **accessToken**: A new access token to be used for accessing protected routes.

- **Failure:**
    - If the `refreshToken` is invalid, expired, or missing:
    ```json
    {
        "message": "Invalid refresh token"
    }
    ```

##### **Example:**
```bash
POST /refresh-token
```
Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkZyb250ZW5kIiwiaWF0IjoxNzM4NTg4MjY1LCJleHAiOjE3Mzg2MzgxMjV9.a8QyZg6g7Dvv5zHblHMRtm0EpxFbzJglXihZ12I3CV4"
}
```

---

### 3. **Logout Route**
#### **`POST /logout`**

##### **Description:**
This route is used to log out the user. The `refreshToken` is deleted from the server’s token store, preventing further access to protected routes until the user logs in again.

##### **Request Body:**
- **refreshToken**: The refresh token that the client is using to log out.

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Logged out successfully"
    }
    ```
    - **Clear Token**: The refresh token is removed from the server, and the user is logged out.

##### **Example:**
```bash
POST /logout
```
Response:
```json
{
    "message": "Logged out successfully"
}
```

---

### 4. **Protected Route**
#### **`GET /`**

##### **Description:**
This route serves as a test endpoint to demonstrate access to protected resources. It sends a personalized message including the user's name.

##### **Authorization Required:**
- The request must include a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Hello <user_name>, welcome to the protected route!"
    }
    ```
    - The response will include the user's name, extracted from the decoded `accessToken`.

- **Failure:**
    - If the `accessToken` is missing, expired, or invalid:
    ```json
    {
        "message": "Token is required"
    }
    ```

##### **Example:**
```bash
GET /
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

Response:
```json
{
    "message": "Hello Frontend, welcome to the protected route!"
}
```

---

### **Common Headers**
- **Authorization**: 
  - For accessing protected routes, send the JWT token as a Bearer token in the Authorization header.

    Example:
    ```http
    Authorization: Bearer <YOUR_ACCESS_TOKEN>
    ```

---

### **Error Codes**
- **401 Unauthorized**: 
    - Returned when the `accessToken` is missing, expired, or invalid.
  
- **403 Forbidden**: 
    - Returned when the `refreshToken` is invalid or expired during the refresh token flow.

---

## **Users API Documentation**

### **Base URL**
- The base URL for user-related API requests is `http://localhost:8082/api/users`.

---

### **Routes**

---

### 1. **Test Route**
#### **`GET /api/users/`**

##### **Description:**
This route serves as a test endpoint to verify that the `/api/users/` route is accessible. The response will include the name of the authenticated user.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Hello, this is the /api/users/ route for <user_name>"
    }
    ```
  
- **Failure:**
    - If the `accessToken` is missing or invalid:
    ```json
    {
        "message": "Token is required"
    }
    ```

##### **Example:**
```bash
GET /api/users/
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```
Response:
```json
{
    "message": "Hello, this is the /api/users/ route for Frontend"
}
```

---

### 2. **Get All Users**
#### **`GET /api/users/`**

##### **Description:**
This route retrieves a list of all registered users.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    [
        {
            "_id": "65abc1234567890def123456",
            "email": "user@example.com",
            "displayName": "User Name",
            "kidsNames": ["Alice", "Bob"]
        },
        {
            "_id": "65abc1234567890def654321",
            "email": "another@example.com",
            "displayName": "Another User",
            "kidsNames": ["Charlie"]
        }
    ]
    ```

- **Failure:**
    - If the server encounters an error:
    ```json
    {
        "error": "Server error while fetching users."
    }
    ```

##### **Example:**
```bash
GET /api/users/
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### 3. **Get User by ID**
#### **`GET /api/users/:id`**

##### **Description:**
Retrieves the details of a specific user, including their created stories.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "email": "user@example.com",
        "displayName": "User Name",
        "kidsNames": ["Alice", "Bob"],
        "createdStories": [
            {
                "_id": "987xyz123456",
                "title": "My First Story"
            }
        ]
    }
    ```

- **Failure:**
    - If the user is not found:
    ```json
    {
        "error": "User not found."
    }
    ```
    - If the server encounters an error:
    ```json
    {
        "error": "Server error while fetching the user."
    }
    ```

##### **Example:**
```bash
GET /api/users/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### 4. **Create a New User**
#### **`POST /api/users/`**

##### **Description:**
Creates a new user with the provided email, password hash, display name, and optional list of kids' names.

##### **Request Body:**
- **email** *(string, required)*: The user's email.
- **passwordHash** *(string, required)*: The hashed password.
- **displayName** *(string, optional)*: The user's display name.
- **kidsNames** *(array, optional)*: A list of the user's kids' names.

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "email": "user@example.com",
        "displayName": "User Name",
        "kidsNames": ["Alice", "Bob"]
    }
    ```

- **Failure:**
    - If email or password is missing:
    ```json
    {
        "error": "Email and password are required."
    }
    ```
    - If the user already exists:
    ```json
    {
        "error": "User already exists."
    }
    ```
    - If the server encounters an error:
    ```json
    {
        "error": "Server error while creating the user."
    }
    ```

##### **Example:**
```bash
POST /api/users/
Content-Type: application/json

{
    "email": "user@example.com",
    "passwordHash": "hashed_password",
    "displayName": "User Name",
    "kidsNames": ["Alice", "Bob"]
}
```

---

### 5. **Update User by ID**
#### **`PUT /api/users/:id`**

##### **Description:**
Updates an existing user by ID with the provided information.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Request Body:**
- Any field from the user schema that needs to be updated.

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "email": "user@example.com",
        "displayName": "Updated Name",
        "kidsNames": ["Alice", "Bob"]
    }
    ```

- **Failure:**
    - If the user is not found:
    ```json
    {
        "error": "User not found."
    }
    ```
    - If the server encounters an error:
    ```json
    {
        "error": "Server error while updating the user."
    }
    ```

##### **Example:**
```bash
PUT /api/users/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json

{
    "displayName": "Updated Name"
}
```

---

### 6. **Delete User by ID**
#### **`DELETE /api/users/:id`**

##### **Description:**
Deletes a specific user by their ID.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "message": "User deleted successfully."
    }
    ```

- **Failure:**
    - If the user is not found:
    ```json
    {
        "error": "User not found."
    }
    ```
    - If the server encounters an error:
    ```json
    {
        "error": "Server error while deleting the user."
    }
    ```

##### **Example:**
```bash
DELETE /api/users/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### **Common Headers**
- **Authorization**: 
  - For accessing protected routes, send the JWT token as a Bearer token in the Authorization header.

    Example:
    ```http
    Authorization: Bearer <YOUR_ACCESS_TOKEN>
    ```

---

### **Error Codes**
- **400 Bad Request**: 
    - Returned when required fields are missing or invalid input is provided.

- **401 Unauthorized**: 
    - Returned when the `accessToken` is missing, expired, or invalid.

- **403 Forbidden**: 
    - Returned when the user does not have permission to perform an action.

- **404 Not Found**: 
    - Returned when the requested user does not exist.

- **500 Internal Server Error**: 
    - Returned when there is an issue on the server side.

---

## **Stories API Documentation**

### **Base URL**
- The base URL for story-related API requests is `http://localhost:8082/api/stories`.

---

### **Routes**

---

### 1. **Test Route**
#### **`GET /api/stories/`**

##### **Description:**
This route serves as a test endpoint to verify that the `/api/stories/` route is accessible. The response will include the name of the authenticated user.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Hello, this is the /api/stories/ route for <user_name>"
    }
    ```

- **Failure:**
    ```json
    {
        "message": "Token is required"
    }
    ```

##### **Example:**
```bash
GET /api/stories/
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```
Response:
```json
{
    "message": "Hello, this is the /api/stories/ route for John Doe"
}
```

---

### 2. **Get All Stories**
#### **`GET /api/stories/`**

##### **Description:**
Retrieves a list of all available stories.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    [
        {
            "_id": "65abc1234567890def123456",
            "userId": "65def1234567890abc654321",
            "title": "My First Story",
            "content": ["Once upon a time..."]
        },
        {
            "_id": "65abc6543217890def123456",
            "userId": "65def9876543210abc654321",
            "title": "Another Story",
            "content": ["It was a dark and stormy night..."]
        }
    ]
    ```

- **Failure:**
    ```json
    {
        "error": "Server error while fetching stories."
    }
    ```

##### **Example:**
```bash
GET /api/stories/
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### 3. **Get a Single Story by ID**
#### **`GET /api/stories/:id`**

##### **Description:**
Retrieves the details of a specific story by its unique ID.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "userId": "65def1234567890abc654321",
        "title": "My First Story",
        "content": ["Once upon a time..."]
    }
    ```

- **Failure:**
    ```json
    {
        "error": "Story not found."
    }
    ```
    ```json
    {
        "error": "Server error while fetching the story."
    }
    ```

##### **Example:**
```bash
GET /api/stories/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### 4. **Create a New Story**
#### **`POST /api/stories/`**

##### **Description:**
Creates a new story associated with the logged-in user.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Request Body:**
- **title** *(string, required)*: The title of the story.
- **content** *(array of strings, required)*: The story content in an array format.

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "userId": "65def1234567890abc654321",
        "title": "My First Story",
        "content": ["Once upon a time..."]
    }
    ```

- **Failure:**
    ```json
    {
        "error": "Title and valid content are required."
    }
    ```
    ```json
    {
        "error": "Server error while creating the story."
    }
    ```

##### **Example:**
```bash
POST /api/stories/
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json

{
    "title": "My First Story",
    "content": ["Once upon a time..."]
}
```

---

### 5. **Update a Story by ID**
#### **`PUT /api/stories/:id`**

##### **Description:**
Updates an existing story. Only the owner of the story can update it.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Request Body:**
- Any field that needs to be updated.

##### **Response:**
- **Success:**
    ```json
    {
        "_id": "65abc1234567890def123456",
        "userId": "65def1234567890abc654321",
        "title": "Updated Story",
        "content": ["Once upon a time, in a faraway land..."]
    }
    ```

- **Failure:**
    ```json
    {
        "error": "Story not found."
    }
    ```
    ```json
    {
        "error": "Unauthorized to update this story."
    }
    ```
    ```json
    {
        "error": "Server error while updating the story."
    }
    ```

##### **Example:**
```bash
PUT /api/stories/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json

{
    "title": "Updated Story",
    "content": ["Once upon a time, in a faraway land..."]
}
```

---

### 6. **Delete a Story by ID**
#### **`DELETE /api/stories/:id`**

##### **Description:**
Deletes a specific story. Only the owner of the story can delete it.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` in the **Authorization header** (`Bearer <token>`).

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Story deleted successfully."
    }
    ```

- **Failure:**
    ```json
    {
        "error": "Story not found."
    }
    ```
    ```json
    {
        "error": "Unauthorized to delete this story."
    }
    ```
    ```json
    {
        "error": "Server error while deleting the story."
    }
    ```

##### **Example:**
```bash
DELETE /api/stories/65abc1234567890def123456
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

### **Common Headers**
- **Authorization**: 
  - For accessing protected routes, send the JWT token as a Bearer token in the Authorization header.

    Example:
    ```http
    Authorization: Bearer <YOUR_ACCESS_TOKEN>
    ```

---

### **Error Codes**
- **400 Bad Request**: 
    - Returned when required fields are missing or invalid input is provided.

- **401 Unauthorized**: 
    - Returned when the `accessToken` is missing, expired, or invalid.

- **403 Forbidden**: 
    - Returned when the user does not have permission to perform an action.

- **404 Not Found**: 
    - Returned when the requested story does not exist.

- **500 Internal Server Error**: 
    - Returned when there is an issue on the server side.