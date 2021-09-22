import { useEffect, useRef, useState } from "react"

import play     from "../assets/forward.png"
import pause    from "../assets/pause.png"
import stop     from "../assets/stop.png"
import next     from "../assets/next.png"
import previous from "../assets/previous.png"
import options  from "../assets/barsHorizontal.png"

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

function Music({audioRef, playlistFuncs}){
  const [isPlaying, setIsPlaying] = useState(false)

  function toggleIsPlaying() {
    setIsPlaying(oldState => !oldState)
  }

  // apply the Audio state to audioRef
  useEffect(()=>{
    if(!audioRef.current){
      return
    }
    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  }, [isPlaying])

  //create ref to audio time range input
  const barRef = useRef(null)
  const [currTime, setCurrTime] = useState(0)
  const [duration, setDuration] = useState(0)

  function resetMusic(){
    if(!audioRef.current){
      return
    }
    toggleIsPlaying()
    audioRef.current.currentTime = 0
  }

  function currTimeHandler(e){
    if(!audioRef.current){
      return
    }
    audioRef.current.currentTime = e.target.value
  }

  function updateMetadata(){
    if(!audioRef.current){
      return
    }
    setDuration(audioRef.current.duration)
  }

  function updateCurrTime(){
    setCurrTime(() => {
      if(!audioRef.current){
        return
      }
      const newCurrTime = audioRef.current.currentTime
      barRef.current.value = newCurrTime
      return newCurrTime 
    })
  }

  function updateAfterEnd(){
    resetMusic()
    toggleIsPlaying()
  }

  useEffect(()=>{
    if(!audioRef.current){
      return
    }
    audioRef.current.addEventListener("loadedmetadata", updateMetadata)
    audioRef.current.addEventListener("timeupdate", updateCurrTime)
    audioRef.current.addEventListener("ended", updateAfterEnd)

    return () => {
      if(!audioRef.current){
        return
      }
      audioRef.current.removeEventListener("loadedmetadata", updateMetadata)
      audioRef.current.removeEventListener("timeupdate", updateCurrTime)
      audioRef.current.removeEventListener("ended", updateAfterEnd)
    }
  }, [])

  return(
    <div>
      <img onClick={playlistFuncs.previous} src={previous.src}/>

      <img onClick={toggleIsPlaying} src={
        isPlaying? pause.src:play.src
      }/>

      <img onClick={resetMusic} src={stop.src}/>

      <img onClick={playlistFuncs.next} src={next.src}/>

      {formatDuration(currTime)}

      <input type="range" max={duration}
        onChange={currTimeHandler} ref={barRef}/>

      {formatDuration(duration)}

      <img onClick={playlistFuncs.show} src={options.src}/>

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

function Player({playlist}){
  const audioRef = useRef(null)
  const [isLoaded, setLoaded] = useState(false)
  const [actualAudio, setActualAudio] = useState(0)

  useEffect(()=>{
    if(!audioRef.current){
      return
    }
    setLoaded(true)

    console.log(playlist, actualAudio)
  }, [audioRef.current])

  if(!playlist[actualAudio]){
    return(<h1>Loading...</h1>)
  }

  const playlistFuncs = {
    next: () => {
      setActualAudio(state => {
        if(state+1 == playlist.length){
          return 0
        }
        return state+1
      })
    },
    previous: () => {
      setActualAudio(state => {
        if(state == 0){
          return playlist.length-1
        }
        return state-1
      })
    },
    show: () => {
      alert('Placeholder to the playlist menu')
    }
  }

  return(
    <div>
      <h2>{playlist[actualAudio].name} - {playlist[actualAudio].singer}</h2>
      {isLoaded? 
        <Music audioRef={audioRef}
          playlistFuncs={playlistFuncs}/> : <h2>Loading...</h2>
      }

      <audio
        preload="metadata"
        src={'/musics/'+playlist[actualAudio].path}
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

export default Player