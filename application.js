let videoContainer = document.querySelector('.video-container');
let container = document.querySelector('.container');
let rotateContainer = document.querySelector('.rotate-container');
let myVideo = document.getElementById('my-video');
let playButton = document.getElementById('play-button');
let pauseButton = document.getElementById('pauseButton');
let volume = document.getElementById('volume');
let volumeRange = document.getElementById('volume-range');
let volumeNumber = document.getElementById('volume-number');
let high = document.getElementById('high');
let low = document.getElementById('low');
let mute = document.getElementById('mute');
let sizeScreen = document.getElementById('size-screen');
let screenCompress = document.getElementById('screen-compress');
let screenExpand = document.getElementById('screen-expand');
let deviceType = "";
const playback = document.querySelector('.playback');
const playbackOptions = document.querySelector('.playback-options');
const currentProgress = document.getElementById('current-progress');
const currentTime = document.getElementById('current-time');
const maximumDuration = document.getElementById('maximum-duration');
const progressBar = document.getElementById('progress-bar');
const playbackSpeedButton = document.getElementById('playback-speed-button');
function slider(){
     valuePercent = (volumeRange.value / volumeRange.max) * 100;
     volumeRange.style.backgroundImage = `linear-gradient(to right,#2887e3 ${valuePercent}%,#000000 ${valuePercent}%)`;
}
let events = {
     mouse: {click: 'click'},
     touch: {click: 'touchstart'},
};
const isTouchDevice = () => {
     try {
          document.createEvent('TouchEvent');
          deviceType = 'touch';
          return true;
     }catch(event){
          deviceType = 'mouse';
          return false;
     }
};
isTouchDevice();
playButton.addEventListener('click',() => {
     myVideo.play();
     pauseButton.classList.remove('hide');
     playButton.classList.add('hide');
});
pauseButton.addEventListener('click',(pauseVideo = () => {
     myVideo.pause();
     pauseButton.classList.add('hide');
     playButton.classList.remove('hide');
}));
playback.addEventListener('click',() => {
     playbackOptions.classList.remove('hide');
});
window.addEventListener('click',(event) => {
     if(!playback.contains(event.target)){
          playbackOptions.classList.add('hide');
     }else if(playbackOptions.contains(event.target)){
          playbackOptions.classList.add('hide');
     }
});
const setPlayback = (value) => {
     playbackSpeedButton.innerText = value + 'x';
     myVideo.playbackRate = value;
};
const muter = () => {
     mute.classList.remove('hide');
     high.classList.add('hide');
     low.classList.add('hide');
     myVideo.volume = 0;
     volumeNumber.innerHTML = 0;
     volumeRange.value = 0;
     slider();
};
high.addEventListener('click',muter);
low.addEventListener('click',muter);
volumeRange.addEventListener('input',() => {
     let volumeValue = volumeRange.value / 100;
     myVideo.volume = volumeValue;
     volumeNumber.innerHTML = volumeRange.value;
     if(volumeRange.value < 50){
          low.classList.remove('hide');
          high.classList.add('hide');
          mute.classList.add('hide');
     }else if(volumeRange.value > 50){
          low.classList.add('hide');
          high.classList.remove('hide');
          mute.classList.add('hide');
     }
});
screenExpand.addEventListener('click',() => {
     screenCompress.classList.remove('hide');
     screenExpand.classList.add('hide');
     videoContainer.requestFullscreen().catch((error) => alert('Your Device Does not Support Full Screen API',error));
     if(isTouchDevice){
          let screenOrientation = screen.orientation;
          if(screenOrientation.type == 'portrait-primary'){
               pauseVideo();
               rotateContainer.classList.remove('hide');
               const myTimeout = setTimeout(() => {
                    rotateContainer.classList.add('hide');
               },3000);
          }
     }
});
screenCompress.addEventListener('click',(normalScreen = () => {
     screenCompress.classList.add('hide');
     screenExpand.classList.remove('hide');
     if(document.fullscreenElement){
          if(document.exitFullscreen){
               document.exitFullscreen();
          }
     }
}));
function exitHandler(){
     if(!document.fullscreenElement) normalScreen();
}
document.addEventListener('fullscreenchange',exitHandler);
const timeFormatter = (timeInput) => {
     let minute = Math.floor(timeInput / 60);
     minute = minute < 10 ? '0' + minute : minute;
     let second = Math.floor(timeInput % 60);
     second = second < 10 ? '0' + second : second;
     return `${minute}:${second}`;
};
setInterval(() => {
     currentTime.innerHTML = timeFormatter(myVideo.currentTime);
     currentProgress.style.width = (myVideo.currentTime / myVideo.duration.toFixed(3)) * 100 + '%';
},1000);
myVideo.addEventListener('timeupdate',() => {
     currentTime.innerText = timeFormatter(myVideo.currentTime);
});
progressBar.addEventListener(events[deviceType].click,(event) => {
     let coordStart = progressBar.getBoundingClientRect().left;
     let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
     let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
     currentProgress.style.width = progress * 100 + '%';
     myVideo.currentTime = progress * myVideo.duration;
     myVideo.play();
     pauseButton.classList.remove('hide');
     playButton.classList.add('hide');
});
window.onload = () => {
     myVideo.onloadedmetadata = () => {
          maximumDuration.innerText = timeFormatter(myVideo.duration);
     };
     slider();
};