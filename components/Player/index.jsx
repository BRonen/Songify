import { useEffect, useRef, useState } from "react"

import play from "./png/forward.png"
import pause from "./png/pause.png"
import stop from "./png/stop.png"

function Music({music}){
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function toggleIsPlaying() {
    setIsPlaying(!isPlaying)
  }

  function resetMusic(){
    if(!audioRef.current){
      return
    }
    audioRef.current.currentTime = 0
  }

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  }, [isPlaying])

  //  Gotta Catch 'Em All! (Bugs)
  //  useEffect(()=>{
  //    console.log()
  //  }, [])

  return(
    <div>
      <h2>{music.name}</h2>
      <img onClick={toggleIsPlaying} src={
        isPlaying? pause.src:play.src
      }/>

      <img onClick={resetMusic} src={stop.src}/>

      <audio 
          src={'/musics/'+music.path}
          autoPlay={true} 
          ref={audioRef}
      />

      <style jsx>{`
        div{
          height: 100%;
          max-height: 20vh;

          padding: 10px;
          margin: 10px;

          border-radius: 20px;

          box-shadow: inset 0 0 10px #999;
          transition: box-shadow 1s;

          background-image: linear-gradient(to bottom, #F0F0F0, #DDD);
        }
        div:hover{
          box-shadow: inset 0 0 3px #DDD;
        }
      `}</style>
    </div>
  )
}

function Player(){
  const [musicArr, setMusicArr] = useState([])

  useEffect(()=>{
    fetch("/musics/index.json", {
      method: "GET"
    }).then(res => {
      res.json().then(arr => {
        setMusicArr(arr)
      })
    })
  }, [])

  return(
    <>{
      musicArr.map((music, index)=>{
        return(
            <Music key={index} music={music}/>
        )
      })
    }</>
  )
}

export default Player