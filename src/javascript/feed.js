import { load, formatDate, extractHashtags, getUserById } from "./utils.js";
import {
  toggleLike,
  deletePost,
  editPost,
  searchPosts,
  sortPosts,
  addComment,
  deleteComment,
} from "./posts.js";

function renderPostCard(post) {
  const currentUser = load("currentUser");
  const isLiked = currentUser && post.likedBy.includes(currentUser.id);
  const isAuthor = currentUser && post.authorId === currentUser.id;

  const postCard = document.createElement("div");
  postCard.className =
    "bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700";
  postCard.id = `post-${post.id}`;

  let postTextHtml = post.text;
  const hashtags = extractHashtags(post.text);
  hashtags.forEach((tag) => {
    const regex = new RegExp(`#${tag}`, "g");
    postTextHtml = postTextHtml.replace(
      regex,
      `<a href="?hashtag=${tag}" class="text-blue-500 hover:underline">#${tag}</a>`
    );
  });

  let imageHtml = "";
  if (post.imageUrl) {
    imageHtml = `
      <img 
        src="${post.imageUrl}" 
        alt="Post image" 
        class="w-full h-64 object-cover rounded-lg mb-4 mt-4"
        onerror="this.style.display='none'"
      />
    `;
  }

  const actionButtons = isAuthor
    ? `
    <div class="flex gap-2">
      <button
        class="text-blue-500 hover:text-blue-700 font-semibold text-sm transition"
        data-post-id="${post.id}"
        data-action="edit"
      >
        Edit
      </button>
      <button 
        class="text-red-500 hover:text-red-700 font-semibold text-sm transition"
        data-post-id="${post.id}"
        data-action="delete"
      >
         Delete
      </button>
    </div>
  `
    : "";

  const commentsHtml = renderComments(post);
  const commentCountText =
    post.comments.length > 0 ? `(${post.comments.length})` : "";

  postCard.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div>
        <a href="?profile=${
          post.authorId
        }" class="font-bold text-gray-900 hover:text-blue-500 text-lg dark:text-white">${
    post.author
  }</a>
        <p class="text-gray-500 text-sm dark:text-gray-400">${formatDate(
          post.createdAt
        )}</p>
      </div>
      ${actionButtons}
    </div>

    <p class="text-gray-800 mb-3 wrap-break-word dark:text-gray-100">${postTextHtml}</p>

    ${imageHtml}

    <div class="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button 
        class="flex items-center gap-2 text-sm font-semibold transition ${
          isLiked
            ? "text-red-500 hover:text-red-700"
            : "text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
        }"
        data-post-id="${post.id}"
        data-action="like"
      >
        <span class="w-5 h-5">${isLiked ? "❤️" : "🤍"}</span>
        <span class="like-count">${post.likes}</span>
      </button>
      <button 
        class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition"
        data-post-id="${post.id}"
        data-action="toggle-comments"
      >
        <span class="w-5 h-5">💬</span>
        <span>${commentCountText}</span>
      </button>
    </div>

    <div id="comments-${post.id}" class="mt-4 hidden">
      ${commentsHtml}
      <div class="mt-3 flex gap-2">
        <input 
          type="text"
          placeholder="Add a comment..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          data-post-id="${post.id}"
          data-action="comment-input"
        />
        <button 
          class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          data-post-id="${post.id}"
          data-action="comment-submit"
        >
          Post
        </button>
      </div>
    </div>
  `;

  return postCard;
}

function renderComments(post) {
  if (!post.comments || post.comments.length === 0) {
    return '<div class="text-gray-500 text-sm dark:text-gray-400">No comments yet</div>';
  }

  return post.comments
    .map((comment) => {
      const isCommentAuthor = load("currentUser")?.id === comment.authorId;
      return `
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-2 text-sm">
          <div class="flex justify-between">
            <a href="?profile=${
              comment.authorId
            }" class="font-semibold text-gray-900 hover:text-blue-500 dark:text-white dark:hover:text-blue-400">${
        comment.author
      }</a>
            ${
              isCommentAuthor
                ? `<button 
              class="text-red-500 hover:text-red-700 text-xs"
              data-post-id="${post.id}"
              data-comment-id="${comment.id}"
              data-action="delete-comment"
            >
            Delete
          </button>`
                : ""
            }
          </div>
          <p class="text-gray-700 dark:text-gray-200 mt-1">${comment.text}</p>
          <p class="text-gray-500 text-xs dark:text-gray-400 mt-1">${formatDate(
            comment.createdAt
          )}</p>
        </div>
      `;
    })
    .join("");
}

function renderFeed(posts) {
  const feedContainer = document.getElementById("feedContainer");
  if (!feedContainer) return;

  feedContainer.innerHTML = "";

  if (posts.length === 0) {
    feedContainer.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">No posts yet. Create the first one!</p>
      </div>
    `;
    return;
  }

  posts.forEach((post) => {
    const postCard = renderPostCard(post);
    feedContainer.appendChild(postCard);
  });

  attachPostEventListeners();
}

function attachPostEventListeners() {
  const feedContainer = document.getElementById("feedContainer");
  if (!feedContainer) return;

  feedContainer.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const postId = button.dataset.postId;
    const commentId = button.dataset.commentId;

    if (action === "like") {
      toggleLike(postId);
    } else if (action === "edit") {
      const postCard = document.getElementById(`post-${postId}`);
      if (!postCard) return;

      // prevent multiple edit forms
      if (postCard.querySelector('[data-action="edit-form"]')) return;

      const posts = load("posts") || [];
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const textP = postCard.querySelector("p.wrap-break-word");
      const imageEl = postCard.querySelector("img");
      if (textP) textP.style.display = "none";
      if (imageEl) imageEl.style.display = "none";

      const formDiv = document.createElement("div");
      formDiv.setAttribute("data-action", "edit-form");
      formDiv.className = "mt-3";
      formDiv.innerHTML = `
        <textarea data-action="edit-text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="4">${post.text}</textarea>
        <input data-action="edit-image" type="text" placeholder="Image URL (optional)" value="${post.imageUrl || ""}" class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        <div class="mt-2 flex gap-2">
          <button data-action="edit-save" data-post-id="${postId}" class="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Save</button>
          <button data-action="edit-cancel" data-post-id="${postId}" class="px-3 py-2 bg-gray-300 text-black rounded-lg text-sm hover:bg-gray-400">Cancel</button>
        </div>
      `;

      postCard.appendChild(formDiv);
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(postId);
      }
    } else if (action === "edit-save") {
      const postCard = document.getElementById(`post-${postId}`);
      if (!postCard) return;
      const textarea = postCard.querySelector('[data-action="edit-text"]');
      const imageInput = postCard.querySelector('[data-action="edit-image"]');
      const newText = textarea ? textarea.value : "";
      const newImage = imageInput ? imageInput.value : "";

      editPost(postId, newText, newImage);
    } else if (action === "edit-cancel") {
      const updatedPosts = load("posts") || [];
      const currentUser = load("currentUser");

      let feedPosts = updatedPosts;
      if (currentUser?.following && currentUser.following.length > 0) {
        feedPosts = updatedPosts.filter(
          (p) =>
            currentUser.following.includes(p.authorId) || p.authorId === currentUser.id
        );
      }

      const sortBy = document.getElementById("sortSelect")?.value || "latest";
      renderFeed(sortPosts(feedPosts, sortBy));
    } else if (action === "toggle-comments") {
      const commentsDiv = document.getElementById(`comments-${postId}`);
      if (commentsDiv) {
        commentsDiv.classList.toggle("hidden");
      }
    } else if (action === "comment-submit") {
      const input = feedContainer.querySelector(
        `input[data-post-id="${postId}"][data-action="comment-input"]`
      );
      if (input) {
        addComment(postId, input.value);
        input.value = "";
      }
    } else if (action === "delete-comment") {
      if (confirm("Delete this comment?")) {
        deleteComment(postId, commentId);
      }
    }
  });

  // Allow Enter key to submit comment
  feedContainer.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.dataset.action === "comment-input") {
      e.preventDefault();
      const postId = e.target.dataset.postId;
      addComment(postId, e.target.value);
      e.target.value = "";
    }
  });
}

export function initFeed() {
  const posts = load("posts") || [];
  const currentUser = load("currentUser");

  // Filter posts from followed users (if user is following people, otherwise show all)
  let feedPosts = posts;
  if (currentUser?.following && currentUser.following.length > 0) {
    feedPosts = posts.filter(
      (p) =>
        currentUser.following.includes(p.authorId) ||
        p.authorId === currentUser.id
    );
  }

  renderFeed(sortPosts(feedPosts, "latest"));

  window.addEventListener("postsUpdated", () => {
    const updatedPosts = load("posts") || [];
    const currentUser = load("currentUser");

    let feedPosts = updatedPosts;
    if (currentUser?.following && currentUser.following.length > 0) {
      feedPosts = updatedPosts.filter(
        (p) =>
          currentUser.following.includes(p.authorId) ||
          p.authorId === currentUser.id
      );
    }

    const sortBy = document.getElementById("sortSelect")?.value || "latest";
    renderFeed(sortPosts(feedPosts, sortBy));
  });
}

export function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    const sortBy = document.getElementById("sortSelect")?.value || "latest";
    const filtered = searchPosts(query);
    renderFeed(sortPosts(filtered, sortBy));
  });
}

export function initSorting() {
  const sortSelect = document.getElementById("sortSelect");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", (e) => {
    const sortBy = e.target.value;
    const searchQuery = document.getElementById("searchInput")?.value || "";
    const filtered = searchPosts(searchQuery);
    renderFeed(sortPosts(filtered, sortBy));
  });
}

export function initFeedPage() {
  initFeed();
  initSearch();
  initSorting();
  initHashtagFilter();
}

function initHashtagFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("hashtag")) {
    const hashtag = urlParams.get("hashtag");
    filterPostsByHashtag(hashtag);
  } else {
    initFeed();
  }
}

function filterPostsByHashtag(hashtag) {
  const posts = load("posts") || [];
  const filtered = posts.filter((p) =>
    extractHashtags(p.text).includes(hashtag)
  );
  renderFeed(sortPosts(filtered, "latest"));
}
