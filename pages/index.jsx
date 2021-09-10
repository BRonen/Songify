import Head from 'next/head'

import Header from '../components/Header'
import Player from '../components/Player'

function Main(){
  return(
    <main>
      <Player/>
      <style jsx>{`
        main{
          margin: 10px;

          padding: 10px;

          border-radius: 20px;
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;

          background-image: linear-gradient(to bottom, #DDD, #F0F0F0);
        }
        div{
          background-color: #000;
        }
      `}</style>
    </main>
  )
}

export default function Home(){
  return (
    <div>
      <Head>
        <title>Hello world</title>
        <link rel="icon" href='/favicon.ico'/>
      </Head>
      <Header/>
      <Main/>

      <style jsx global>{`
        *{
          padding: 0px;
          margin: 0px;
          box-sizing: border-box;

          text-decoration: none;
        }
        body{
          background-color: #DDDDDC;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          box-shadow: 1px 1px 2px #000 inset;
          border-radius: 10px;
          background: #666;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 20px;
        }
      `}</style>
    </div>
  )
}
