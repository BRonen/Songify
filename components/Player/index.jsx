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

function Music({audioRef, setLoaded, playlistFuncs}){
  const [isPlaying, setIsPlaying] = useState(false)

  function toggleIsPlaying() {
    setIsPlaying(oldState => !oldState)
  }

  //create ref to audio time range input
  const barRef = useRef(null)
  const [currTime, setCurrTime] = useState(0)
  const [duration, setDuration] = useState(0)

  function resetMusic(){
    if(!audioRef.current){
      return
    }
    setIsPlaying(false)
    audioRef.current.currentTime = 0
  }

  function currTimeHandler(e){
    if(!audioRef.current){
      return
    }
    audioRef.current.currentTime = e.target.value
  }

  function onLoadeddata(){
    console.log(audioRef, isPlaying)
    setLoaded(true)
  }

  function onLoadedmetadata(){
    if(!audioRef.current){
      return
    }
    setDuration(audioRef.current.duration)
  }

  function onCurrTime(){
    setCurrTime(() => {
      if(!audioRef.current){
        return
      }
      const newCurrTime = audioRef.current.currentTime
      barRef.current.value = newCurrTime
      return newCurrTime 
    })
  }

  function onEnded(){
    playlistFuncs.next()
  }

  useEffect(()=>{
    if(!audioRef.current){
      return
    }
    audioRef.current.addEventListener("loadedmetadata", onLoadedmetadata)
    audioRef.current.addEventListener("loadeddata", onLoadeddata)
    audioRef.current.addEventListener("timeupdate", onCurrTime)
    audioRef.current.addEventListener("ended", onEnded)

    return () => {
      if(!audioRef.current){
        return
      }
      audioRef.current.removeEventListener("loadedmetadata", onLoadedmetadata)
      audioRef.current.removeEventListener("loadeddata", onLoadeddata)
      audioRef.current.removeEventListener("timeupdate", onCurrTime)
      audioRef.current.removeEventListener("ended", onEnded)
    }
  }, [])

  // apply the Audio state to audioRef
  //and return the right src of button
  function playPauseButton(){
    if(audioRef.current){
      if(isPlaying){
        audioRef.current.play()
      }else{
        audioRef.current.pause()
      }
    }
    return isPlaying? pause.src:play.src
  }

  return(
    <div>
      <img onClick={playlistFuncs.previous} src={previous.src}/>

      <img onClick={toggleIsPlaying} src={
        playPauseButton()
      }/>

      <img onClick={resetMusic} src={stop.src}/>

      <img onClick={playlistFuncs.next} src={next.src}/>

      <div className="bar">
        {formatDuration(currTime)}

        <input type="range" max={duration}
          onChange={currTimeHandler} ref={barRef}/>

        {formatDuration(duration)}
      </div>

      <img onClick={playlistFuncs.show} src={options.src}/>

      <style jsx>{`
        div{
          display: flex;
          gap: 5px 10px;
          justify-content: space-around;
        }
        .bar{
          width: 100%;
        }
        @media (max-width: 600px){
          div{
            flex-wrap: wrap;
          }
          .bar{
            flex-wrap: nowrap;
            width: 80%;
          }
        }
        @media (max-width: 400px){
          .bar{
            width: 73%;
          }
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

function PlaylistView({playlist, setAudio, actualIndex}){
  return(<>
    <div className='top'>
      <h2>Name</h2>
      <h2>Singer</h2>
    </div>
    <div className='list'>
      {
        playlist.map( (music, index) => (
          <div className={'row' + (index == actualIndex? ' actual' : '')}
            onClick={() => setAudio(index)} key={index}>
            <h3>{music.name}</h3>
            <h3>{music.singer}</h3>
          </div>
        ) )
      }
    </div>

    <style jsx>{`
      .top{
        display: grid;
        grid-template-columns: 3fr 1fr;
        grid-gap: 10px;
        margin-top: 15px;
        border-radius: 20px;
        background-image: linear-gradient(to bottom, #E0E0E0, #CCC);
      }
      .top h2{
        padding: 5px 10px;
      }
      .list{
        overflow-y: scroll;
        width: 100%;
        max-height: 20vh;
      }
      .row{
        display: grid;
        grid-template-columns: 3fr 1fr;
        grid-gap: 10px;
        margin-top: 3px;
        border-radius: 15px;
        cursor: pointer;
        background-image: linear-gradient(to bottom, #F0F0F0, #DDD);
      }
      .row:hover{
        box-shadow: inset 0 0 3px #000;
      }
      .row h3{
        padding: 5px 10px;
      }
      .actual{
        background-image: linear-gradient(to bottom, #F0F0F0, #EEE);
        box-shadow: inset -1px -1px 3px #000;
      }
    `}</style>
  </>)
}

function Player({playlist}){
  const audioRef = useRef(null)
  const [isLoaded, setLoaded] = useState(false)
  const [actualAudio, setActualAudio] = useState(0)
  const [listVisibility, setListVisibility] = useState(false)

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
      setListVisibility(state => !state)
    }
  }

  return(
    <div>
      <h2>{playlist[actualAudio].name} - {playlist[actualAudio].singer}</h2>

      <Music audioRef={audioRef} setLoaded={setLoaded}
        playlistFuncs={playlistFuncs}/>

      <audio
        preload="metadata"
        autoPlay
        src={'http://localhost:5000/api/musics/'+playlist[actualAudio].id}
        ref={audioRef}
      />

      {listVisibility?
        <PlaylistView playlist={playlist}
          setAudio={setActualAudio} actualIndex={actualAudio}/> : ''
      }

      <style jsx>{`
        div{
          height: 100%;
          overflow: hidden;

          padding: 15px;
          margin: 10px;

          border-radius: 20px;

          box-shadow: inset 0 0 10px #999;
          transition: box-shadow 1s;

          background-image: linear-gradient(to bottom, #F0F0F0, #DDD);
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