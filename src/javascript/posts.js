import { load, save, formatDate, generateId, isValidUrl } from "./utils.js";

function getPosts() {
  return load("posts") || [];
}

function setPosts(posts) {
  save("posts", posts);
}

export function createPost(text, imageUrl) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login to create a post");
    return null;
  }

  if (!text || !text.trim()) {
    alert("Post content cannot be empty");
    return null;
  }

  if (imageUrl && !isValidUrl(imageUrl)) {
    alert("Invalid image URL");
    return null;
  }

  const posts = getPosts();
  const newPost = {
    id: generateId(),
    authorId: currentUser.id,
    author: currentUser.name,
    text: text.trim(),
    imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : null,
    likes: 0,
    likedBy: [],
    comments: [],
    createdAt: Date.now(),
  };

  posts.unshift(newPost);
  setPosts(posts);

  window.dispatchEvent(new Event("postsUpdated"));
  return newPost;
}

export function deletePost(postId) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login");
    return;
  }

  const posts = getPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    alert("Post not found");
    return;
  }

  const post = posts[postIndex];

  // No one can delete only author
  if (post.authorId !== currentUser.id) {
    alert("You can only delete your own posts");
    return;
  }

  posts.splice(postIndex, 1);
  setPosts(posts);

  window.dispatchEvent(new Event("postsUpdated"));
}

export function editPost(postId, newText, newImageUrl) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login to edit a post");
    return null;
  }

  if (!newText || !newText.trim()) {
    alert("Post content cannot be empty");
    return null;
  }

  if (newImageUrl && !isValidUrl(newImageUrl)) {
    alert("Invalid image URL");
    return null;
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    alert("Post not found");
    return null;
  }

  if (post.authorId !== currentUser.id) {
    alert("You can only edit your own posts");
    return null;
  }

  post.text = newText.trim();
  post.imageUrl = newImageUrl && newImageUrl.trim() ? newImageUrl.trim() : null;
  setPosts(posts);

  window.dispatchEvent(new Event("postsUpdated"));
  return post;
}

export function toggleLike(postId) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login to like posts");
    return;
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    alert("Post not found");
    return;
  }

  const likeIndex = post.likedBy.indexOf(currentUser.id);

  if (likeIndex === -1) {
    post.likedBy.push(currentUser.id);
  } else {
    post.likedBy.splice(likeIndex, 1);
  }

  post.likes = post.likedBy.length;
  setPosts(posts);

  window.dispatchEvent(new Event("postsUpdated"));
}

export function searchPosts(query) {
  const posts = getPosts();
  if (!query.trim()) {
    return posts;
  }

  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.text.toLowerCase().includes(lowerQuery) ||
      p.author.toLowerCase().includes(lowerQuery)
  );
}

export function sortPosts(posts, sortBy = "latest") {
  const sorted = [...posts];

  switch (sortBy) {
    case "oldest":
      return sorted.reverse();

    case "mostLiked":
      return sorted.sort((a, b) => b.likes - a.likes);

    case "latest":
    default:
      return sorted;
  }
}

export function initPostCreation() {
  const postBtn = document.getElementById("postBtn");
  const postInput = document.getElementById("postInput");
  const postImage = document.getElementById("postImage");

  if (postBtn && postInput) {
    postBtn.addEventListener("click", () => {
      const text = postInput.value;
      const imageUrl = postImage ? postImage.value : "";

      if (createPost(text, imageUrl)) {
        postInput.value = "";
        if (postImage) postImage.value = "";
      }
    });
  }
}

export function addComment(postId, text) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login to comment");
    return null;
  }

  if (!text || !text.trim()) {
    return null;
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const comment = {
    id: generateId(),
    authorId: currentUser.id,
    author: currentUser.name,
    text: text.trim(),
    createdAt: Date.now(),
  };

  post.comments.push(comment);
  setPosts(posts);
  window.dispatchEvent(new Event("postsUpdated"));
  return comment;
}

export function deleteComment(postId, commentId) {
  const currentUser = load("currentUser");
  if (!currentUser) {
    alert("Please login");
    return;
  }

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const commentIndex = post.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) return;

  const comment = post.comments[commentIndex];
  if (comment.authorId !== currentUser.id) {
    alert("You can only delete your own comments");
    return;
  }

  post.comments.splice(commentIndex, 1);
  setPosts(posts);
  window.dispatchEvent(new Event("postsUpdated"));
}
