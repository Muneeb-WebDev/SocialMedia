# Social Media Web App

A fully functional, responsive social media web application built with HTML, Tailwind CSS v4.1, and Vanilla JavaScript (ES Modules). All data is stored locally using the browser's LocalStorage API.

## Features

 User Authentication
- Sign up with name, email, and password
- Log in with email and password
- Secure password hashing (simple hash for demo)
- Current user session management
- Auto-redirect if not logged in

Post Management
- Create posts with text content
- Add optional image URLs to posts
- View all posts in chronological order
- Newest posts appear first by default

Social Features
- Like/unlike posts with heart emoji
- Real-time like counter updates
- Delete your own posts
- Delete confirmation dialog

Search & Filtering
- Real-time post search
- Search by post text or author name
- Sort posts by:
  - Latest First (newest first)
  - Oldest First (oldest first)
  - Most Liked (by like count)

Responsive Design
- Mobile-first layout
- Adapts beautifully to tablets and desktops
- Sticky header for easy navigation
- Card-based modern UI
- Smooth transitions and hover effects

Data Persistence
- All data stored in browser's LocalStorage
- Users array: store all registered users
- Posts array: store all posts
- Current user: track logged-in user
- Data persists across browser sessions

## Project Structure

```
social-media-app/
├── src/
│   ├── pages/
│   │   ├── index.html       (Feed page)
│   │   ├── login.html       (Log in page)
│   │   └── signup.html      (Sign up page)
│   ├── javascript/
│   │   ├── auth.js          (Authentication logic)
│   │   ├── posts.js         (Post management)
│   │   ├── feed.js          (Feed rendering)
│   │   └── utils.js         (Utility functions)
│   ├── input.css            (Tailwind CSS input)
│   └── output.css           (Generated CSS)
├── package.json
├── tailwind.config.js
└── README.md
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build CSS

Generate the output CSS from Tailwind:

```bash
npm run build:css
```

Or watch for changes during development:

```bash
npm run watch:css
```

### 3. Run the App

Open `src/pages/signup.html` or `src/pages/login.html` in your browser to get started.

For a better experience, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000/src/pages/signup.html`

## Usage

### Creating an Account

1. Go to the Sign Up page
2. Enter your full name, email, and password
3. Confirm your password
4. Click "Sign Up"
5. You'll be redirected to the Log In page

### Logging In

1. Enter your email and password
2. Click "Log In"
3. You'll be taken to the feed page

### Creating a Post

1. In the left sidebar, enter your post text
2. Optionally, paste an image URL
3. Click "Post"
4. Your post appears at the top of the feed

### Interacting with Posts

- **Like a Post**: Click the heart icon to like/unlike
- **Delete a Post**: Click the trash icon (only on your posts)
- **Search**: Use the search box to filter posts by text or author
- **Sort**: Use the dropdown to change post order

### Logging Out

Click the "Logout" button in the top-right corner of the header.

## Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS v4.1**: Utility-first CSS framework with CLI
- **Vanilla JavaScript (ES Modules)**: No frameworks, pure modern JavaScript
- **LocalStorage API**: Browser-native data persistence
- **Responsive Design**: Mobile-first approach

## Features Breakdown

### Authentication (auth.js)
- `initSignup()`: Handle sign up form submission
- `initLogin()`: Handle login form submission
- `initLogout()`: Handle logout button
- `updateWelcomeMessage()`: Display current user name
- `protectPage()`: Redirect unauthorized users

### Post Management (posts.js)
- `createPost(text, imageUrl)`: Create new post
- `deletePost(postId)`: Delete post
- `toggleLike(postId)`: Like/unlike post
- `searchPosts(query)`: Search posts by text
- `sortPosts(posts, sortBy)`: Sort posts
- `initPostCreation()`: Initialize post form

### Feed Rendering (feed.js)
- `renderPostCard(post)`: Create post card element
- `renderFeed(posts)`: Render all posts
- `attachPostEventListeners()`: Handle post interactions
- `initFeed()`: Initialize feed page
- `initSearch()`: Initialize search functionality
- `initSorting()`: Initialize sort dropdown
- `initFeedPage()`: Initialize all feed features

### Utilities (utils.js)
- `save(key, value)`: Save to LocalStorage
- `load(key)`: Load from LocalStorage
- `formatDate(date)`: Format timestamps
- `generateId()`: Create unique IDs
- `isValidEmail(email)`: Validate email format
- `hashPassword(password)`: Hash passwords
- `sanitize(value)`: Prevent XSS attacks
- `isValidUrl(url)`: Validate image URLs

## Tailwind CSS Classes Used

Custom utility classes defined in `input.css`:

- `.btn`: Base button styles
- `.btn-primary`: Blue primary button
- `.btn-secondary`: Green secondary button
- `.btn-danger`: Red danger button
- `.card`: White card with shadow
- `.input-field`: Styled form inputs
- `.label`: Form label styling

## Data Structure

### Users
```javascript
{
  id: "1234567890",
  name: "John Doe",
  email: "john@example.com",
  password: "hashedPassword123",
  createdAt: 1700000000000
}
```

### Posts
```javascript
{
  id: "uniqueId123",
  authorId: "1234567890",
  author: "John Doe",
  text: "This is my first post!",
  imageUrl: "https://example.com/image.jpg",
  likes: 5,
  likedBy: ["userId1", "userId2"],
  createdAt: 1700000000000
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Edit posts
- Comments on posts
- User profiles
- Follow users
- Private messages
- Notifications
- Image upload (instead of URLs)
- Dark mode toggle
- User roles (admin, moderator)
- Post categories/tags

## License

MIT

## Notes

- This is a demonstration app. For production, use proper backend authentication.
- Passwords are hashed with a simple algorithm for demo purposes only.
- All data is stored in browser LocalStorage and will be cleared if browser data is deleted.
- No backend server is required to run this app.
- The app works completely offline once loaded.

---

**Created with ❤️ using HTML, Tailwind CSS, and Vanilla JavaScript**
"# SocialMedia" 
