const songName = document.getElementById('nome-musica');
const bandName = document.getElementById('nome-banda');
const song = document.getElementById('musica');
const cover = document.getElementById('imagem');
const play = document.getElementById('tocar');
const next = document.getElementById('proxima');
const previous = document.getElementById('anterior');
const currentProgress = document.getElementById('progresso-atual');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('aleatorio');
const repeatButton = document.getElementById('repetir');
const songTime = document.getElementById('tempo-musica');
const totalTime = document.getElementById('tempo-total-musica');
const likeButton = document.getElementById('curtir');

const jacaranda = {
    songName: 'Jacarandá',
    artist: 'Vitor Kley',
    file: 'jacarandá',
    liked: false,
};

const sol = {
    songName: 'O Sol',
    artist: 'Vitor Kley',
    file: 'sol',
    liked: false,
};

const pupila = {
    songName: 'Pupila',
    artist: 'Vitor Kley',
    file: 'pupila',
    liked: false,
};

const morena = {
    songName: 'Morena',
    artist: 'Vitor Kley',
    file: 'morena',
    liked: false,
};


let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [jacaranda, sol, pupila, morena];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    isPlaying = pause;
}

function playPauseSong(){
    if(isPlaying === true){
        pauseSong();
    }else{
        playSong();
    }
}

function initializeSong(){
    cover.src = `imagens/${sortedPlaylist[index].file}.jpg`;
    song.src = `musicas/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong() {
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }else{
        index -= 1;
    }

    initializeSong();
    playSong();
}

function nextSong() {
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }else{
        index += 1;
    }

    initializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime/song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
    totalTime.innerText = toHHMMSS(song.duration - song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleButtonClicked() {
    if(isShuffled === false){
        isShuffled = true;
        shufflePlaylist(sortedPlaylist);
        shuffleButton.classList.add('button-active')
    }else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active')
    }
}

function shufflePlaylist(preShufflePlaylist) {
    const size = preShufflePlaylist.length;
    let currentIndex = size - 1;

    while(currentIndex > 0){
       let randomIndex = Math.floor(Math.random() * size);
       let aux = preShufflePlaylist[currentIndex];
       preShufflePlaylist[currentIndex] = preShufflePlaylist[randomIndex]
       preShufflePlaylist[randomIndex] = aux;
       currentIndex -= 1;
    }

}

function repeatButtonClicked() {
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active')
    }else{
        repeatOn = false;
        repeatButton.classList.remove('button-active')
    }
}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }else{
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor((originalNumber - hours * 3600 - min * 60));

    return `${hours.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender() {
    if(sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }else{
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.classList.remove('button-active');
    }
}

function likeButtonClicked() {
    if(sortedPlaylist[index].liked === true){
        sortedPlaylist[index].liked = false;
    }else{
        sortedPlaylist[index].liked = true;
    }

    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseSong);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);

