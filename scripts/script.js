const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyCyalnHmO9knMa-EV0z3LpBVsCD7Zs10y4";

const container = document.getElementById("videos-container");


let query='';
 function searchData(){
  query = document.getElementById('search-input').value;
  getVideos(query);

 }


async function getVideos(query) {
  const url = `${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&maxResults=21&videoDuration=long`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();
  const videos = data.items;
  getVideoData(videos);
}

async function getVideoData(videos) {
  let videoData = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoId = video.id.videoId;
    videoData.push(await getVideoDetails(videoId));
  }
  renderVideos(videoData);
}

async function getVideoDetails(videoId) {
  const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();
  return data.items[0];
}

function renderVideos(videos) {
  container.innerHTML = ``;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const thumbnailUrl = video.snippet.thumbnails.maxres.url;
    const publishDate = formatVideoDate(videos[i].snippet.publishedAt);
    const channelId = videos[i].snippet.channelId;

    // Fetch Channel Details
    fetchChannelDetails(channelId)
    .then((channel)=> {
      const channelLogo = channel.snippet.thumbnails.default.url;
    
    container.innerHTML += `
    <div class="video-info" onclick="openVideoDetails('${video.id}')" >
        <div class="video-image">
          <img src="${thumbnailUrl}" alt="video title" />
        </div>  
        <div class="video-description">
        <div class = "channel-info"> 
          <div class="channel-avatar">
            <img src="${channelLogo}" alt="channel-logo" />
          </div>
          <div class="video-title">${video.snippet.title}</div>
          </div>
          <div class="channel-description">
            <p class="channel-name">${video.snippet.channelTitle}</p>
            <div class=channel-number>
            <p class="video-views">${video.statistics.viewCount} views</p>
            <p class="video-time">${publishDate}</p>
            </div>
        </div>
      </div>
      `;
  })
  .catch((error)=>{
    console.log("Error fetching channel details: ", error);
  });
}
}

function fetchChannelDetails(channelId) {
 
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        return data.items[0];
      } else {
        throw new Error('Channel details not found');
      }
    });
}

function formatVideoDate(apiDate) {
  const videoDate = new Date(apiDate);
  const currentDate = new Date();
  const timeDifference = currentDate - videoDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year's ago`;
  } else if (months > 0) {
    return `${months} month's ago`;
  } else if (days > 0) {
    return `${days} day's ago`;
  } else if (hours > 0) {
    return `${hours} hour's ago`;
  } else if (minutes > 0) {
    return `${minutes} minute's ago`;
  } else {
    return `${seconds} second's ago`;
  }
}

function openVideoDetails(videoId) {
  localStorage.setItem("videoId", videoId);
  window.open("./videoDetails.html");
}

getVideos("");




