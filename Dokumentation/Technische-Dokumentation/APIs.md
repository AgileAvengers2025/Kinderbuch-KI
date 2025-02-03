## **API Documentation**

### **Base URL**
- The base URL for the API is `http://localhost:8082` (or whatever port is set in the `PORT` environment variable).

---

### **Routes**

---

### 1. **Login Route**
#### **`POST /login`**

##### **Description:**
This route is used to log in a user by providing a `username` and `password` (though in this case, the credentials are hardcoded for simplicity). It will return an `accessToken` and store a `refreshToken` in a cookie.

##### **Request Body:**
- No body is required. The route is designed with a mock user for demonstration purposes.
  
##### **Response:**
- **Success:**
    ```json
    {
        "accessToken": "JWT_TOKEN"
    }
    ```
    - **accessToken**: A JWT (JSON Web Token) used for accessing protected routes.

- **Cookies:**
    - **refreshToken**: A long-lived refresh token stored in the cookie to refresh the access token.

##### **Example:**
```bash
POST /login
```
Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkZyb250ZW5kIiwiaWF0IjoxNzM4NTc4NDYxLCJleHAiOjE3Mzg1ODIwNjF9.fixuFssDN3gypWYKMszywnUNckRQdRG9fdHmW8nPekg"
}
```

---

### 2. **Refresh Token Route**
#### **`POST /refresh-token`**

##### **Description:**
This route is used to refresh an expired `accessToken` using the stored `refreshToken` from the cookies.

##### **Request Body:**
- No body is required.

##### **Cookies Required:**
- **refreshToken**: The refresh token stored in the cookie that is sent automatically from the client.

##### **Response:**
- **Success:**
    ```json
    {
        "accessToken": "NEW_JWT_TOKEN"
    }
    ```
    - **accessToken**: A new access token that can be used to access protected routes.

- **Failure:**
    - If there is no `refreshToken` or if the token is invalid:
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
This route logs out the user by clearing the `refreshToken` cookie. This will prevent further access to protected routes until the user logs in again.

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Logged out"
    }
    ```
    - **Clear Cookie**: The `refreshToken` cookie will be cleared from the client.

##### **Example:**
```bash
POST /logout
```

Response:
```json
{
    "message": "Logged out"
}
```

---

### 4. **Protected Route**
#### **`GET /`**

##### **Description:**
This is a protected route that requires a valid `accessToken` (either via `Authorization` header or cookies) to access. The route sends a personalized message including the user's name.

##### **Authorization Required:**
- The request must contain a valid JWT `accessToken` either in the **Authorization header** (`Bearer <token>`) or in the **cookies**.

##### **Response:**
- **Success:**
    ```json
    {
        "message": "Hello <user_name>, welcome to the protected route!"
    }
    ```
    - The user's name will be personalized, extracted from the decoded JWT.

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

### 5. **Users Routes** (`/api/users`)
#### **`GET /api/users`**
##### **Description:**
- **Returns** a list of all users (functionality can be added depending on your app).

#### **`POST /api/users`**
##### **Description:**
- **Create a new user** (functionality can be added depending on your app).

#### **`GET /api/users/:id`**
##### **Description:**
- **Returns a specific user** based on the `id`.

---

### 6. **Stories Routes** (`/api/stories`)
#### **`GET /api/stories`**
##### **Description:**
- **Returns a list of all stories** (functionality can be added depending on your app).

#### **`POST /api/stories`**
##### **Description:**
- **Create a new story** (functionality can be added depending on your app).

#### **`GET /api/stories/:id`**
##### **Description:**
- **Returns a specific story** based on the `id`.

---

### **Common Headers**
- **Authorization**: 
  - For accessing protected routes, you can send the JWT token as a Bearer token in the Authorization header.

    Example:
    ```http
    Authorization: Bearer <YOUR_ACCESS_TOKEN>
    ```

---

### **Cookies**
- The `refreshToken` is stored as a **HTTP-only cookie** on the client side. This cookie is automatically sent with each request to the server, and is used for generating a new `accessToken` if the original `accessToken` expires.

---

### **Error Codes**
- **401 Unauthorized**: 
    - This is returned when the `accessToken` is missing, expired, or invalid.
  
- **403 Forbidden**: 
    - This is returned when the `refreshToken` is invalid or expired during the refresh token flow.

---

### **Security Considerations**
- The `refreshToken` is stored in a **secure HTTP-only cookie**, which ensures that it is not accessible by JavaScript (helps protect against XSS).
- Ensure that you are using HTTPS in production to prevent tokens from being transmitted over unsecured channels.
