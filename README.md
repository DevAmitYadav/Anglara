# Multi-Level Category Management API

This project is a **scalable and well-structured Node.js backend** using Express and MongoDB. It implements a **multi-level category management system** with authentication and role-based access control.

## Features 🚀

### **Authentication & Authorization**
- JWT-based authentication system.
- User registration and login.
- Protected API routes using authentication middleware.

### **Category Management**
- Create categories with optional parent categories.
- Retrieve categories in a tree structure.
- Update category name or status (active/inactive).
- Delete categories while reassigning child categories.
- When marking a category as inactive, all subcategories are also marked inactive.

### **Performance Optimizations**
- Proper MongoDB indexing for fast queries.
- Efficient bulk updates for status changes.
- Optimized queries to avoid unnecessary deep lookups.

---
## Tech Stack 🛠️

- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (MongoDB ORM)
- **JWT** (Authentication & Authorization)
- **Postman** (API testing - optional)

---
## Installation & Setup ⚙️

1. **Clone the repository**
```sh
git clone https://github.com/DevAmitYadav/Anglara.git
cd your-repo
```

2. **Install dependencies**
```sh
npm install
```

3. **Create a `.env` file and configure environment variables**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Run the application**
```sh
npm start
```

---
## API Endpoints 📡

### **Authentication Routes** 🔐
| Method | Endpoint          | Description           | Auth Required |
|--------|------------------|-----------------------|--------------|
| POST   | `/api/auth/register` | Register a new user | No          |
| POST   | `/api/auth/login`    | Login and get a JWT | No          |

### **Category Routes** 📂
| Method | Endpoint                 | Description                                        | Auth Required |
|--------|-------------------------|----------------------------------------------------|--------------|
| POST   | `/api/categories`         | Create a new category                            | Yes (Admin)  |
| GET    | `/api/categories`         | Get all categories in a tree structure           | Yes         |
| PUT    | `/api/categories/:id`     | Update a category name or status                 | Yes (Admin)  |
| DELETE | `/api/categories/:id`     | Delete a category and reassign subcategories     | Yes (Admin)  |

---
## Folder Structure 📂
```
/project-root
│── /config         # Configuration files (DB connection, etc.)
│── /controllers    # Route handlers (business logic)
│── /models         # Mongoose models (database schemas)
│── /routes         # API route handlers
│── /middleware     # Authentication & authorization middleware
│── /utils          # Utility functions
│── .env            # Environment variables
│── server.js       # Application entry point
```

---
## MongoDB Indexing & Performance Optimization 📈
- **Indexes:** Created on category `name` for faster lookups.
- **Tree Structure Query Optimization:** Fetch categories using `$graphLookup`.
- **Bulk Updates:** Used `updateMany()` to efficiently change status.

---
## Testing 🛠️
1. **Run the API using Postman**
2. Import the Postman collection (available in the repo).
3. Test authentication and category APIs.

---
## License 📜
MIT License

---
### 🚀 Developed by Amit Yadav

