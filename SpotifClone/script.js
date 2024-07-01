console.log("lets write javaScript")
//await can only be used inside async keyword

// function to fetch song from folder
let currentSong= new Audio();  // making global variable

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds)|| seconds<0){
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60)

    const formattedMinutes = String(minutes).padStart(2,"0")
    const formattedSeconds = String(remainingSeconds).padStart(2,'0')
    
    return `${ formattedMinutes}:${formattedSeconds}`
}


async function getSongs(){
    let a= await fetch("http://127.0.0.1:5500/songs/")     // getting link from chrome browser
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as =div.getElementsByTagName("a");
    
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs
    // console.log(songs)
    // console.log(as);
}

const playMusic=(track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src="/songs/"+ track
    
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }

    currentSong.play()

    // play.src="pause.svg"

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

}


async function main(){

    // let currentSong= new Audio();


    // get the list of all the songs
    let songs = await getSongs();
    // console.log(songs)

    playMusic(songs[0], true)

    // show all the songs in the playlist

    let songUL =document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML+ `
        
        <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div> ${song.replaceAll("20%"," ")}</div>
                <div>Indresh</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>
        
        
        `;
    }

    //not palying first song  user have choice 

    // //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc,audio.currentTime)
    //     // let duration = audio.duration;
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    // });
    

    // Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        // console.log(e.getElementsByTagName("div")[0])
    })


    //Attach an event listner to play, net and previous 
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
        }
        else{
            currentSong.pause()
            play.src="play.svg"
        }
    })

    



    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.
        currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`


        //to change seek button or move when song is playing
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%"
    })


    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        // console.log(e.target, e.offsetX)
        let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent+"%"

        //now also changing song time 
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

}

main()