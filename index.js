const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
const PLAYER_STORAGE_KEY = 'KUN_PLAYER'
const player = $('.player');
const heading = $('header h2')
const cdTHumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist= $('.playlist')


const app = { 
currentIndex: 0,
isPlaying: false,
isRandom: false,
isRepeat: false,
config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

song:  [
{
    name: 'Dỗi Ít Thôi Ôm Đê',
    singer: 'Phúc Du',
    path: './music/Dỗi Ít Thôi Ôm Đê.mp3 ',
    image: './img/phucdu.jpg'
},
{
    name: 'ExsHateMe',
    singer: 'Bray ft Amee',
    path: './music/ExsHateMe-BRayMasewAMee-5878683.mp3 ',
    image: './img/Amee1.jpg'
},
{
    name: 'Greyd',
    singer: 'Greyd',
    path: './music/Greyd-GREYD-8968331.mp3 ',
    image: './img/greyd.jpg'
},
{
    name: 'Hai Mươi Hai',
    singer: 'Amee',
    path: './music/HaiMuoiHai22-HuaKimTuyenAMEE-7231237.mp3 ',
    image: './img/Amee2.jpg'
},
{
    name: 'Không Thể SayS',
    singer: 'Hiếu Thứ 2',
    path: './music/Không Thể Say.mp3 ',
    image: './img/hieuthu2.jpg'
},
{
    name: 'MamaBoy',
    singer: 'Amee',
    path: './music/MamaBoy-AMee-6804000.mp3 ',
    image: './img/Amee3.jpg'
}
],
setConfig: function(key, value ){
this.config[key] = value;
localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))

},
render: function (){
 const htmls = this.song.map((song,index ) => { 
    return` 
    <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index="${index}">
<div class="thumb" style="background-image: url('${song.image}')"> 
</div>
<div class="body">
<h3 class="title">${song.name}</h3>
<p class="author">${song.singer}</p>
</div>
<div class="option">
<i class="fas fa-ellipsis-h"></i>
</div>
</div>
    `
 })
 playlist.innerHTML = htmls.join('')
},
defineProperties: function (){
Object.defineProperty(this, 'currentSong', {
get: function () {
  return this.song[ this.currentIndex] }
})
},
handleEvent: function(){

const _this = this
const cd = $('.cd')
const cdWidth = cd.offsetWidth
// xử lí cd quay / dừng 
const cdThumbAnimate = cdTHumb.animate([{ transform: "rotate(360deg)" }], {
duration: 10000, // 10 seconds
iterations: Infinity
}) 
cdThumbAnimate.pause()
// xử lí phóng to thu nhỏ
document.onscroll = function(){
const scrollTop =  window.scrollY || document.documentElement.scrollTop
const newcdWidth = cdWidth - scrollTop
cd.style.width = newcdWidth > 0 ? newcdWidth + 'px': 0
cd.style.opacity = newcdWidth / cdWidth
}
// pausing or playing
playBtn.onclick = function(){
if(_this.isPlaying) {
  
  audio.pause()
}
else {
  audio.play();
}
};
// khi song được play
audio.onplay = function() {  
  _this.isPlaying = true;
  player.classList.add('playing')
  cdThumbAnimate.play()
};
// khi song được pause

audio.onpause = function() {  
  _this.isPlaying = false;
player.classList.remove('playing')
cdThumbAnimate.pause()

}
// khi tiến độ bài hát thay đổi 
audio.ontimeupdate = function() { 
if (audio.duration) {
  const progressPercent = Math.floor(audio.currentTime / audio.duration * 100 )
  progress.value = progressPercent      
}
}
// xử lí khi tua
progress.onchange = function (e) {
const seekTime = audio.duration / 100 * e.target.value
audio.currentTime = seekTime
}
// NEXT SONG
nextBtn.onclick = function(){
if (_this.isRandom) {
_this.playRandomSong()
} else { 
_this.nextSong() 
}
audio.play()
_this.render()
_this.scrollToActiveSong()
}
// pause song
prevBtn.onclick = function() {
if (_this.isRandom) {
_this.playRandomSong()
} else { 
_this.prevSong()
}
audio.play()
_this.render()
_this.scrollToActiveSong()

}
// next khi ket thuc bai hat
audio.onended = function (){
if (_this.isRepeat) {
audio.play()
} else { 
nextBtn.click()
}
}
//Xử lý khi phat lại bài hát
repeatBtn.onclick = function(){
_this.isRepeat = !_this.isRepeat
_this.setConfig('isRepeat', _this.isRepeat)
repeatBtn.classList.toggle('active',_this.isRepeat)
}
// random song 
randomBtn.onclick = function() {
_this.isRandom = !_this.isRandom
_this.setConfig('isRandom', _this.isRandom)
randomBtn.classList.toggle('active', _this.isRandom)
}
// lắng nge hành vi click vào playlist
playlist.onclick = function(e){
const songNode = e.target.closest('.song:not(.active)')
// xử lí khi click vào song
if ( songNode || e.target.closest('.option')){ 
if ( songNode ){
_this.currentIndex = Number(songNode.dataset.index)
_this.loadCurrentSong()
_this.render()
audio.play()
}
if (e.target.closest(".option")) {
}
}
};
},
scrollToActiveSong: function() {
setTimeout(() => {
$('.song.active').scrollIntoView({
  behavior: 'smooth',
  block: 'center'
}
)
},300);
},
loadCurrentSong: function(){

heading.textContent =  this.currentSong.name
cdTHumb.style.backgroundImage = `url('${this.currentSong.image}')`
audio.src = this.currentSong.path
},

loadConfig: function () {
this.isRandom = this.config.isRandom;
this.isRepeat = this.config.isRepeat;
},
nextSong: function(){
this.currentIndex++
if (this.currentIndex >= this.song.length) {
this.currentIndex = 0
}
this.loadCurrentSong()
},
prevSong: function(){
this.currentIndex--
if (this.currentIndex < 0) {
this.currentIndex = this.song.length - 1
}
this.loadCurrentSong()
},
playRandomSong: function() {
let newIndex
do {
newIndex = Math.floor(Math.random() * this.song.length)

} while (newIndex === this.currentIndex)
this.currentIndex = newIndex 
this.loadCurrentSong()
},

start: function(){
//load
this.loadConfig()
// định nghĩa các thuộc tính cho object
this.defineProperties()
// lắng nge/ xử lí các event
 this.handleEvent() 
// tải thông tin bài hát vào ứng dụng 
this.loadCurrentSong()  
// render playlist
 this.render()
 randomBtn.classList.toggle("active", this.isRandom);
 repeatBtn.classList.toggle("active", this.isRepeat);
}

};
app.start();