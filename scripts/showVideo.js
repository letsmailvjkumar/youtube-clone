const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyCKxFnTCJ6J22zzaUzJX2LxoqYxgzIpaSo";

const video_container = document.getElementById("yt-video");
const videoId = localStorage.getItem("videoId");
const commentsContainer = document.getElementById("comments");

video_container.src= `https://www.youtube.com/embed/${videoId}`;
async function getComments() {
    const url = `${BASE_URL_1}/commentThreads?key=${API_KEY_1}&videoId=${videoId}&maxResults=80&order=time&part=snippet`;
    const response = await fetch(url, {
      method: "get",
    });
    const data = await response.json();
  
    const comments = data.items;
  
    renderComments(comments);
  }
  
  function renderComments(comments) {
    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
    const profileImageUrl = comment.snippet.topLevelComment.snippet.authorProfileImageUrl;
    const authorName = comment.snippet.topLevelComment.snippet.authorDisplayName;
    const commentText = comment.snippet.topLevelComment.snippet.textDisplay;

    const commentElement = document.createElement("div");
    commentElement.className = "comment";

    const commentContentElement = document.createElement("div");
    commentContentElement.className = "comment-content";

    const profileImageElement = document.createElement("img");
    profileImageElement.src = profileImageUrl;
    profileImageElement.alt = "Profile Picture";
    profileImageElement.className = "profile-image";

    const authorInfoElement = document.createElement("div");
    authorInfoElement.className = "author-info";

    const authorNameElement = document.createElement("p");
    authorNameElement.className = "author-name";
    authorNameElement.textContent = authorName;

    const commentTextElement = document.createElement("p");
    commentTextElement.className = "comment-text";
    commentTextElement.textContent = commentText;

    authorInfoElement.appendChild(authorNameElement);
    authorInfoElement.appendChild(commentTextElement);

    commentContentElement.appendChild(profileImageElement);
    commentContentElement.appendChild(authorInfoElement);

    commentElement.appendChild(commentContentElement);

    commentsContainer.appendChild(commentElement);
    });
  }
  
  getComments();