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
  document.addEventListener("DOMContentLoaded", () => {
    const videoDetailsContainer = document.getElementById("video-details");
    const selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
  
    if (selectedVideo) {
      // Display the video details
      videoDetailsContainer.innerHTML = `
        <h2>${selectedVideo.snippet.title}</h2>
        <p>Channel: ${selectedVideo.snippet.channelTitle}</p>
        <p>Views: ${selectedVideo.statistics.viewCount}</p>
        <p>Likes: ${selectedVideo.statistics.likeCount}</p>
        <!-- Add other video details you want to display -->
      `;
    } else {
      // Handle the case when no selected video is found
      videoDetailsContainer.innerHTML = "<p>No video details found.</p>";
    }
  });
  const infoBox = document.getElementById("info");
  async function getVideoInfo() {
    const url = `${BASE_URL_1 }/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY_1}`;
    const response = await fetch(url);
    const data = await response.json();
    const videoInfo = data.items[0];
    renderVideoInfo(videoInfo);
  }
  
  function renderVideoInfo(videoInfo) {
    const title = videoInfo.snippet.localized.title;
    const channel = videoInfo.snippet.channelTitle;
    const likes = videoInfo.statistics.likeCount;
    const views = videoInfo.statistics.viewCount;
    const date = new Date(videoInfo.snippet.publishedAt);
    const publishedDate = date.toLocaleDateString();
  
    const infoCard = document.createElement("div");
    infoCard.className = "card";
    infoCard.innerHTML = `
      <p id="title">${title}</p>
      <p class="channel">${channel}</p>
      <span>Likes: ${likes} &bullet; Views: ${views} &bullet; Published on: ${publishedDate}</span>
    `;
  
    infoBox.appendChild(infoCard);
  }
  
  getComments();
  getVideoInfo();