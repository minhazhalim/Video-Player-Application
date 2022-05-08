const playPauseButton = document.querySelector('.play-pause-button');
const theaterButton = document.querySelector('.theater-button');
const fullScreenButton = document.querySelector('.full-screen-button');
const miniPlayerButton = document.querySelector('.mini-player-button');
const muteButton = document.querySelector('.mute-button');
const captionsButton = document.querySelector('.captions-button');
const speedButton = document.querySelector('.speed-button');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const previewImage = document.querySelector('.preview-image');
const thumbnailImage = document.querySelector('.thumbnail-image');
const volumeSlider = document.querySelector('.volume-slider');
const videoContainer = document.querySelector('.video-container');
const timelineContainer = document.querySelector('.timeline-container');
const video = document.querySelector('video');
const captions = video.textTracks[0];
captions.mode = 'hidden';
let isScrubbing = false;
let wasPaused;
let volumeLevel;
function togglePlay(){
     video.paused ? video.play() : video.pause();
}
function toggleTheaterMode(){
     videoContainer.classList.toggle('theater');
}
function toggleFullScreenMode(){
     if(document.fullscreenElement == null){
          videoContainer.requestFullscreen();
     }else{
          document.exitFullscreen();
     }
}
function toggleMiniPlayerMode(){
     if(videoContainer.classList.contains('mini-player')){
          document.exitPictureInPicture();
     }else{
          video.requestPictureInPicture();
     }
}
function toggleCaptions(){
     const isHidden = captions.mode === 'hidden';
     captions.mode = isHidden ? 'showing' : 'hidden';
     videoContainer.classList.toggle('captions',isHidden);
}
function toggleMute(){
     video.muted = !video.muted;
}
function skip(duration){
     video.currentTime += duration;
}
function changePlaybackSpeed(){
     let newPlaybackRate = video.playbackRate + 0.25;
     if(newPlaybackRate > 2) newPlaybackRate = 0.25;
     video.playbackRate = newPlaybackRate;
     speedButton.textContent = `${newPlaybackRate}x`;
}
document.addEventListener('fullscreenchange',() => {
     videoContainer.classList.toggle('full-screen',document.fullscreenElement);
});
video.addEventListener('play',() => {
     videoContainer.classList.remove('paused');
});
video.addEventListener('pause',() => {
     videoContainer.classList.add('paused');
});
video.addEventListener('enterpictureinpicture',() => {
     videoContainer.classList.add('mini-player');
});
video.addEventListener('leavepictureinpicture',() => {
     videoContainer.classList.remove('mini-player');
});
video.addEventListener('volumechange',() => {
     volumeSlider.value = video.volume;
     if(video.muted || video.volume === 0){
          volumeSlider.value = 0;
          volumeLevel = 'muted';
     }else if(video.volume >= 0.5){
          volumeLevel = 'high';
     }else{
          volumeLevel = 'low';
     }
     videoContainer.dataset.volumeLevel = volumeLevel;
});
volumeSlider.addEventListener('input',event => {
     video.volume = event.target.value;
     video.muted = event.target.value === 0;
});
playPauseButton.addEventListener('click',togglePlay);
video.addEventListener('click',togglePlay);
theaterButton.addEventListener('click',toggleTheaterMode);
fullScreenButton.addEventListener('click',toggleFullScreenMode);
miniPlayerButton.addEventListener('click',toggleMiniPlayerMode);
captionsButton.addEventListener('click',toggleCaptions);
muteButton.addEventListener('click',toggleMute);
speedButton.addEventListener('click',changePlaybackSpeed);
const leadingZeroFormatter = new Intl.NumberFormat(undefined,{minimumIntegerDigits: 2});
function formatDuration(time){
     const hours = Math.floor(time / 3600);
     const minutes = Math.floor(time / 60) % 60;
     const seconds = Math.floor(time % 60);
     if(hours === 0){
          return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
     }else{
          return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
     }
}
video.addEventListener('loadeddata',() => {
     totalTime.textContent = formatDuration(video.duration);
});
video.addEventListener('timeupdate',() => {
     currentTime.textContent = formatDuration(video.currentTime);
     const percent = video.currentTime / video.duration;
     timelineContainer.style.setProperty('--progress-position',percent);
});
function handleTimelineUpdate(event){
     const rectangle = timelineContainer.getBoundingClientRect();
     const percent = Math.min(Math.max(0,event.x - rectangle.x),rectangle.width) / rectangle.width;
     const previewImageNumber = Math.max(1,Math.floor((percent * video.duration) / 10));
     const previewImageSource = `./assets/previewImgs/preview${previewImageNumber}.jpg`;
     previewImage.src = previewImageSource;
     timelineContainer.style.setProperty('--preview-position',percent);
     if(isScrubbing){
          event.preventDefault();
          thumbnailImage.src = previewImageSource;
          timelineContainer.style.setProperty('--progress-position',percent);
     }
}
timelineContainer.addEventListener('mousemove',handleTimelineUpdate);
document.addEventListener('mousemove',event => {
     if(isScrubbing) handleTimelineUpdate(event);
});
function toggleScrubbing(event){
     const rectangle = timelineContainer.getBoundingClientRect();
     const percent = Math.min(Math.max(0,event.x - rectangle.x),rectangle.width) / rectangle.width;
     isScrubbing = (event.buttons & 1) === 1;
     videoContainer.classList.toggle('scrubbing',isScrubbing);
     if(isScrubbing){
          wasPaused = video.paused;
          video.pause();
     }else{
          video.currentTime = percent * video.duration;
          if(!wasPaused) video.play();
     }
     handleTimelineUpdate(event);
}
timelineContainer.addEventListener('mousedown',toggleScrubbing);
document.addEventListener('mouseup',event => {
     if(isScrubbing) toggleScrubbing(event);
});
document.addEventListener('keydown',event => {
     const tagName = document.activeElement.tagName.toLowerCase();
     if(tagName === 'input') return;
     switch(event.key.toLowerCase()){
          case " ":
               if(tagName === 'button') return;
          case 'k':
               togglePlay();
               break;
          case 'f':
               toggleFullScreenMode();
               break;
          case 't':
               toggleTheaterMode();
               break;
          case 'i':
               toggleMiniPlayerMode();
               break;
          case 'm':
               toggleMute();
               break;
          case 'arrowleft':
          case 'j':
               skip(-5);
               break;
          case 'arrowright':
          case 'l':
               skip(5);
               break;
          case 'c':
               toggleCaptions();
               break;
     }
});