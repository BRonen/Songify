import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Header from '../components/Header'

function Main(){
  const [name, setName] = useState('')
  const [singer, setSinger] = useState('')
  const fileRef = useRef(null)

  function handleSubmit(e){
    e.preventDefault()

    const file = fileRef.current.files[0]

    const formData = new FormData()
    if(name) formData.append('name', name)
    if(singer) formData.append('singer', singer)
    if(file) formData.append('music', file)


    console.log(formData)

    fetch('http://localhost:5000/api', {
      method: 'POST',
      body: formData
    }).then(res => {
      console.log(res)
      res.json().then(data => {
        console.log(data)
      })
    })
  }

  return(
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={e => setName(e.target.value)}
          placeholder="Name:"
        />
        <input
          type="text"
          onChange={e => setSinger(e.target.value)}
          placeholder="Singer:"
        />
        <input
          type="file"
          ref={fileRef}
        />
        <Link href="/">
          <button>Upload music</button>
        </Link>
      </form>

      <style jsx>{`
        main{
          margin: 10px;

          padding: 10px;

          border-radius: 20px;
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;

          background-image: linear-gradient(to bottom, #DDD, #F0F0F0);
        }

        form{
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          padding: 0 20vw 15px;
        }

        @media (max-width: 600px){
          form{
            padding: 0 5vw 15px;
          }
        }

        form *{
          font-size: 1.4em;
          padding: 5px;
          border-radius: 20px;
        }

        form button{
          color: #102021;
          background-image: linear-gradient(to bottom, #FFFFFC , #DDDDDC);
          box-shadow: 0px 0px 10px #AAAAAC inset;
        }

        form button:hover{
          box-shadow: 0px 0px 10px #DDDDDC inset;
          background-color: #FFFFFC;
        }
      `}</style>
    </main>
  )
}

export default function Home(){
  return (
    <div>
      <Head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="theme-color" content="#DDDDDD"/>
        <title>River Song - Upload</title>
        <link rel="icon" href='/favicon.ico'/>
      </Head>

      <Header pageButton={{
        path: '/',
        text: 'Home',
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
    </div>
  )
}
