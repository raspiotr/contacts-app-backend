### Contacts App (backend: Node.js, Express, MongoDB, JWT, Nodemailer)

**Contact Management App with User Creation**

---

### Supported Routes:

- **GET /api/contacts** - Returns an array of all contacts in JSON format.
- **GET /api/contacts/:id** - If such an 'id' exists, returns a contact object in JSON format.
- **POST /api/contacts** - Receives a body in the format { name, email, phone }; returns an object with the added 'id'.
- **DELETE /api/contacts/:id** - If such an 'id' exists, removes the contact from the database.
- **PUT /api/contacts/:id** - Receives a JSON body with updates to any of the fields: 'name', 'email', and 'phone'.
- **PATCH /api/contacts/:id/favorite** - Receives a JSON body with an update to the 'favorite' field.
- **POST /users/signup** - Receives a body in the format { email, password }; creates a user in the database.
- **POST /users/login** - Receives a body in the format { email, password }; returns a 'token'.
- **GET /users/logout** - Checks the 'token' in the middleware; removes the token from the current user in the database.
- **GET /users/current** - Checks the 'token' in the middleware; returns the user data.
- **PATCH /users/avatars** - Allows updating the user's avatar.
- **GET /users/verify/:verificationToken** - Allows verifying the user's email address.
- **POST /users/verify** - Receives a body in the format { email }; resends an email with the 'verificationToken' to the specified email.
