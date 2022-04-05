import { useState, useEffect } from 'react'
import Head from 'next/head'

import Header from '../components/Header'
import Player from '../components/Player'

import cross from '../components/assets/cross15x15.png'

function Main(){
  const [musicArr, setMusicArr] = useState([])

  //here can be some api or whatever
  useEffect(() => {
    fetch('http://localhost:5000/api', {
      method: 'GET'
    }).then(res => {
      res.json().then(arr => {
        console.log(arr)
        setMusicArr(arr)
      })
    })
  }, [])

  return(
    <main>
      <Player playlist={musicArr}/>

      <style jsx>{`
        main{
          margin: 10px;

          padding: 10px;

          border-radius: 20px;
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;

          background-image: linear-gradient(to bottom, #DDD, #F0F0F0);
        }
        input[type=search]{
          width: 100%;
          height: 35px;

          margin-bottom: 15px;
          padding: 5px;

          font-size: 25px;
          border-radius: 20px;
          box-shadow: inset 0px 0px 3px #000;

          background: #F9F9F9;
        }
        input[type=submit]{
          height: 35px;
          max-width: 125px;
          margin: 0px 10px;
          padding: 0px 10px;
          font-size: 25px;
          border-radius: 20px;
          box-shadow: inset 0px 0px 3px #000;
        }
        input:hover,
        input:focus{
          background: #FFF;
        }
        input::-webkit-search-cancel-button{
          position: relative;
          right: 15px;
          height: 20px;
          width: 20px;

          appearance: none;
          border-radius: 10px;

          background: url(${cross.src});
          background-size: cover;
        }
      `}</style>
    </main>
  )
}

export default function Home(){
  return (
    <>
      <Head>
        <title>River Song</title>
        <link rel="icon" href='/favicon.ico'/>
      </Head>
      <Header pageButton={{
        path: '/upload',
        text: 'Upload',
      }}/>
      <Main/>

      <style jsx global>{`
        *{
          padding: 0px;
          margin: 0px;
          box-sizing: border-box;
          text-decoration: none;
        }
        body{
          background-color: #DDD;
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          box-shadow: 1px 1px 2px #000 inset;
          border-radius: 10px;
          background: linear-gradient(to bottom, #666, #AAA);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #AAA, #666);
          border-radius: 20px;
        }
      `}</style>
    </>
  )
}
