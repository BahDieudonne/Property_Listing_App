# PropSpace

PropSpace is a full-stack web application for browsing and listing properties for rent or sale. Users can create accounts, post property listings with photos, and search for homes by city, price, type, and listing purpose.

---

## What Does It Do?

PropSpace works like a mini real-estate platform:

- **Visitors** can browse all available properties, filter by city, price range, property type (Apartment, House, Studio), and listing purpose (For Rent / For Sale), and view full details of any property.
- **Registered users** can post new listings with photos, edit or delete listings they own, and manage their account profile.

---

## Why Is It Useful?

Finding or posting a property is still largely done informally in many places. PropSpace puts everything in one place:

- Landlords and sellers get a clean way to showcase their properties with photos and all relevant details.
- Buyers and renters can filter listings to find exactly what fits their budget and needs without scrolling through irrelevant posts.
- Ownership is enforced — only the person who created a listing can modify or delete it, keeping the platform trustworthy.

---

## How to Install and Run It

### What You Need First

- [Node.js](https://nodejs.org/) version 18 or higher
- [MongoDB](https://www.mongodb.com/) running locally, or a free cloud cluster on MongoDB Atlas

---

### Step 1 — Clone the project

```bash
git clone <repo-url>
cd PropSpace
```

---

### Step 2 — Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder with the following content:

```
MONGO_URI=mongodb://localhost:27017/propspace
JWT_SECRET=replace_this_with_a_long_random_string
PORT=5000
```

Then start the server:

```bash
node index.js
```

The API will be running at `http://localhost:5000`.

---

### Step 3 — Load sample data (optional)

To populate the database with 9 demo properties and a test account, run:

```bash
node seed.js
```

You can then log in with:

```
Email:    demo@propspace.com
Password: password123
```

---

### Step 4 — Set up the frontend

Open a new terminal window and run:

```bash
cd client
npm install
npm run dev
```

Open your browser and go to `http://localhost:5173`. The app is ready.

---

## How to Contribute

Contributions are welcome! Here is how to get involved:

1. **Fork** this repository on GitHub.
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**, then commit them with a clear message explaining what you did and why.
4. **Push** your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** on GitHub. Describe what changed, why it matters, and how to test it.

Please keep each pull request focused on a single change — it makes reviewing much faster and easier.

---

## Author

Built by **Bah Dieudonne** as a Second Semester JavaScript Programming project.
