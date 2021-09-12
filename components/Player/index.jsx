import { useEffect, useRef, useState } from "react"

import play from "./assets/forward.png"
import pause from "./assets/pause.png"
import stop from "./assets/stop.png"

function formatDuration(duration){
    const {floor} = Math
    let seconds = floor(duration%60)
    let minutes = floor(duration/60)
    let result = ''
    //get 00:00 - 9999:60 time template
    result += minutes<10? `0${minutes}:`:`${minutes}:`
    result += seconds<10? `0${seconds}`:`${seconds}`
    return result
  }

function Controls({audioRef}){
  const [isPlaying, setIsPlaying] = useState(false)

  function toggleIsPlaying() {
    setIsPlaying(oldState => !oldState)
  }

  useEffect(()=>{
    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  }, [isPlaying])

  function resetMusic(){
    audioRef.current.currentTime = 0
  }

  function currTimeHandler(e){
    audioRef.current.currentTime = e.target.value
  }

  const barRef = useRef(null)
  const [currTime, setCurrTime] = useState(0)
  const [duration, setDuration] = useState(0)

  function updateMetadata(){
    setDuration(audioRef.current.duration)
  }

  function updateCurrTime(){
    setCurrTime(() => {
      const newCurrTime = audioRef.current.currentTime
      barRef.current.value = newCurrTime
      return newCurrTime 
    })
  }

  function updateAfterEnd(){
    console.log('etsetest')
    resetMusic()
    toggleIsPlaying()
  }

  useEffect(()=>{
    audioRef.current.addEventListener("loadedmetadata", updateMetadata)
    audioRef.current.addEventListener("timeupdate", updateCurrTime)
    audioRef.current.addEventListener("ended", updateAfterEnd)

    return () => {
      audioRef.current.removeEventListener("loadeddata", updateMetadata)
      audioRef.current.removeEventListener("timeupdate", updateCurrTime)
      audioRef.current.removeEventListener("ended", updateAfterEnd)
    }
  }, [])

  return(
    <div>
      <img onClick={toggleIsPlaying} src={
        isPlaying? pause.src:play.src
      }/>

      <img onClick={resetMusic} src={stop.src}/>

      {formatDuration(currTime)}

      <input type="range" max={duration}
        onChange={currTimeHandler} ref={barRef}/>

      {formatDuration(duration)}

      <style jsx>{`
        div{
          display: flex;
        }
        input[type=range] {
          height: 26px;
          appearance: none;
          margin: 10px 5px;
          width: 100%;
          background-color: rgba(0,0,0,0);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 15px;
          border-radius: 20px;
          background: #DDD;
          box-shadow: inset 1px 1px 3px #000;
          border: inset 1px solid #000;
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 30px;
          margin-top: -3px;
          border-radius: 20px;
          background: #000;
          box-shadow: 1px 1px 1px #DDD;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

function Music({music}){
  const audioRef = useRef(null)
  const [isLoaded, setLoaded] = useState(false)

  //  Gotta Catch 'Em All! (Bugs)
    useEffect(()=>{
      if(audioRef == null || !audioRef.current){
        return
      }
      setLoaded(true)
    }, [audioRef])

  return(
    <div>
      <h2>{music.name}</h2>
      {isLoaded? 
        <Controls audioRef={audioRef}/> : 'Loading...'
      }

      <audio controls={false}
          preload="metadata"
          src={'/musics/'+music.path}
          ref={audioRef}
      />

      <style jsx>{`
        div{
          height: 100%;
          max-height: 25vh;

          padding: 15px;
          margin: 10px;

          border-radius: 20px;

          box-shadow: inset 0 0 10px #999;
          transition: box-shadow 1s;

          background-image: linear-gradient(to bottom, #F0F0F0, #DDD);
        }
        div:hover{
          box-shadow: inset 0 0 3px #DDD;
        }
        h2{
          margin: 5px;
          margin-bottom: 10px;
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