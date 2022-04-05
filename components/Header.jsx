import Link from 'next/link'

function Header({ pageButton }){
  return(
    <header>
      <a href="https://github.com/BRonen">
        <img src="https://avatars.githubusercontent.com/u/33203683?v=4"/>
      </a>

      <Link href={pageButton?.path || "/"}>
        <button align="right">
          <h1>{pageButton?.text || "Home"}</h1>
        </button>
      </Link>
      
      <style jsx>{`
        header{
          display: flex;
          align-items: stretch;
          justify-content: space-between;

          margin: 10px;
          padding: 10px;

          border-radius: 20px;

          background-image: linear-gradient(to bottom, #F0F0F0 , #DDDDDD);
        }

        img{
          width: auto;
          max-height: 15vh;
          min-height: 100%;

          border-radius: 100%;
          border: 1px outset #757780;

          transition-property: transform;
          transition-duration: 1.5s;
        }
        img:hover{
          transform: rotateZ(360deg);
          border: 2px inset #4CAFD6;
        }

        button{
          display: flex;
          justify-content: center;
          align-items: center;

          text-decoration: underline;

          padding: 5px 15px;

          border-radius: 15%;

          color: #102021;
          background-color: #FFFFFC;
          border: 1px solid #DDDDDC;
          box-shadow: 0px 0px 10px #AAAAAC inset;
          background-image: linear-gradient(to bottom, #FFFFFC , #DDDDDC);

          cursor: pointer;
        }
        button:hover{
          background-color: #FFFFFC;
          border: 2px outset #4CAFD6;
          background-image: linear-gradient(to bottom, #DDDDDC , #FFFFFC);
        }

        button h1{
          text-decoration: none;
        }
    `}</style>
    </header>
  )
}

export default Header