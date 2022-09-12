const container = document.querySelector('.container');
const video = container.querySelector('video');
const videoTimeline = container.querySelector('.video-timeline');
const progressBar = container.querySelector('.progress-bar');
const volumeButton = container.querySelector('.volume i');
const input = container.querySelector('.left input');
const currentVideoTime = container.querySelector('.current-video-time');
const videoDuration = container.querySelector('.video-duration');
const skipBackward = container.querySelector('.skip-backward i');
const skipForward = container.querySelector('.skip-forward i');
const playPause = container.querySelector('.play-pause i');
const playbackSpeed = container.querySelector('.playback-speed span');
const speedOptions = container.querySelector('.speed-options');
const pictureInPicture = container.querySelector('.picture-in-picture span');
const fullScreen = container.querySelector('.fullscreen i');
let timer;
const hideControls = () => {
     if(video.paused) return;
     timer = setTimeout(() => {
          container.classList.remove('show-controls');
     },3000);
}
hideControls();
container.addEventListener('mousemove',() => {
     container.classList.add('show-controls');
     clearTimeout(timer);
     hideControls();
});
const formatTime = time => {
     let hours = Math.floor(time / 3600);
     let minutes = Math.floor(time / 60) % 60;
     let seconds = Math.floor(time % 60);
     hours = hours < 10 ? `O${hours}` : hours;
     minutes = minutes < 10 ? `O${minutes}` : minutes;
     seconds = seconds < 10 ? `O${seconds}` : seconds;
     if(hours == 0){
          return `${minutes}:${seconds}`;
     }
     return `${hours}:${minutes}:${seconds}`;
}
videoTimeline.addEventListener('mousemove',event => {
     let timelineWidth = videoTimeline.clientWidth;
     let offsetX = event.offsetX;
     let percent = Math.floor((offsetX / timelineWidth) * video.duration);
     const progressTime = videoTimeline.querySelector('span');
     offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
     progressTime.style.left = `${offsetX}px`;
     progressTime.innerText = formatTime(percent);
});
videoTimeline.addEventListener('click',event => {
     let timelineWidth = videoTimeline.clientWidth;
     video.currentTime = (event.offsetX / timelineWidth) * video.duration;
});
video.addEventListener('timeupdate',event => {
     let {currentTime,duration} = event.target;
     let percent = (currentTime / duration) * 100;
     progressBar.style.width = `${percent}%`;
     currentVideoTime.innerText = formatTime(currentTime);
});
video.addEventListener('loadeddata',() => {
     videoDuration.innerText = formatTime(video.duration);
});
const draggableProgressBar = event => {
     let timelineWidth = videoTimeline.clientWidth;
     progressBar.style.width = `${event.offsetX}px`;
     video.currentTime = (event.offsetX / timelineWidth) * video.duration;
     currentVideoTime.innerText = formatTime(video.currentTime);
}
volumeButton.addEventListener('click',() => {
     if(!volumeButton.classList.contains('fa-volume-high')){
          video.volume = 0.5;
          volumeButton.classList.replace('fa-volume-xmark','fa-volume-high');
     }else{
          video.volume = 0.0;
          volumeButton.classList.replace('fa-volume-high','fa-volume-xmark');
     }
     input.value = video.volume;
});
input.addEventListener('input',event => {
     video.volume = event.target.value;
     if(event.target.value == 0){
          return volumeButton.classList.replace('fa-volume-high','fa-volume-xmark');
     }
     volumeButton.classList.replace('fa-volume-xmark','fa-volume-high');
});
speedOptions.querySelectorAll('li').forEach(option => {
     option.addEventListener('click',() => {
          video.playbackRate = option.dataset.speed;
          speedOptions.querySelector('.active').classList.remove('active');
          option.classList.add('active');
     });
});
document.addEventListener('click',event => {
     if(event.target.tagName !== 'SPAN' || event.target.className !== 'material-symbols-rounded'){
          speedOptions.classList.remove('show');
     }
});
fullScreen.addEventListener('click',() => {
     container.classList.toggle('fullscreen');
     if(document.fullscreenElement){
          fullScreen.classList.replace('fa-compress','fa-expand');
          return document.exitFullscreen();
     }
     fullScreen.classList.replace('fa-expand','fa-compress');
     container.requestFullscreen();
});
playbackSpeed.addEventListener('click',() => speedOptions.classList.toggle('show'));
pictureInPicture.addEventListener('click',() => video.requestPictureInPicture());
skipBackward.addEventListener('click',() => video.currentTime -= 5);
skipForward.addEventListener('click',() => video.currentTime += 5);
video.addEventListener('play',() => playPause.classList.replace('fa-play','fa-pause'));
video.addEventListener('pause',() => playPause.classList.replace('fa-pause','fa-play'));
playPause.addEventListener('click',() => video.paused ? video.play() : video.pause());
videoTimeline.addEventListener('mousedown',() => videoTimeline.addEventListener('mousemove',draggableProgressBar));
document.addEventListener('mouseup',() => videoTimeline.removeEventListener('mousemove',draggableProgressBar));