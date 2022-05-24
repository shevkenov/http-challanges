const videoContainer = document.querySelector(".video-container");
const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const fullScreeBtn = document.querySelector(".full-screen-btn");
const video = document.querySelector("video");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
const captions = document.querySelector(".captions-btn");
const timeline = document.querySelector(".timeline");
const timelineContainer = document.querySelector(".timeline-container");
const thumb = document.querySelector(".thumb-indicator");


// duration 
video.addEventListener("loadeddata", () => {
    totalTime.textContent = formatTimer(video.duration);
})

video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTimer(video.currentTime);
    const progress = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", progress);
})

function formatTimer(time){
    const seconds = ('0' + Math.floor(time % 60)).slice(-2) ;
    const minutes = ('0' + Math.floor((time / 60) % 60)).slice(-2);
    const hour = ('0' + Math.floor(time / 3600)).slice(-2);

    if(hour === '00'){
        return `${minutes}:${seconds}`
    }

    return `${hour}:${minutes}:${seconds}`
}

// audio control
volumeSlider.addEventListener("input", (e) => {
    video.volume = e.target.value;
    video.muted = video.volume === 0;
})

muteBtn.addEventListener("click", () => {
    video.muted = !video.muted
});

video.addEventListener("volumechange", () => {
    const volume = volumeSlider.value;

    let volumeType;
    if(video.muted || video.volume === 0){
        volumeSlider.value = 0;
        volumeType = "muted"
    }else if(volume >= .5){
        volumeType = "high";
    }else{
        volumeType = "low";
    }
    videoContainer.dataset.volumeLevel = volumeType;
})


// view mode
theaterBtn.addEventListener('click', () => {
    videoContainer.classList.toggle("theater");
})

fullScreeBtn.addEventListener('click', () => {
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
})

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle('full', document.fullscreenElement)
});

miniPlayerBtn.addEventListener('click', () => {
    if(videoContainer.classList.contains("mini-player")){
        document.exitPictureInPicture();
    }else{
        video.requestPictureInPicture();
    }
})

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player");
})

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player");
})

// play video
document.addEventListener('keydown', (e) => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if(tagName === 'input') return;
    switch (e.key.toLowerCase()) {
        case ' ':
            if(tagName === 'button') return;
        case 'k':
            toggleVideo()
            break;
        case 'arrowleft':
            skip(-5);
            break
        case 'arrowright':
            skip(5);
            break
        default:
            break;
    }
})

function skip(seconds){
    video.currentTime += seconds
}

video.addEventListener('click', toggleVideo);

video.addEventListener('play', () => {
    videoContainer.classList.remove("paused");
})

video.addEventListener('pause', () => {
    videoContainer.classList.add("paused");
})

playPauseBtn.addEventListener("click", toggleVideo)

function toggleVideo() {
    video.paused ? video.play() : video.pause();
}

// timeline
timelineContainer.addEventListener("mousemove", (e) => {
    const rect  = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    timelineContainer.style.setProperty("--preview-position", percent);
});
