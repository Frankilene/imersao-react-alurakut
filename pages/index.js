import { useState, useEffect } from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import { AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';

import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import MainGrid  from "../src/components/MainGrid";
import ProfileSideBar from '../src/components/ProfileSideBar';
import Box from '../src/components/Box';
import ProfileRelationsBox from '../src/components/ProfileRelationsBox';



export default function Home(props) {
    const githubUser = props.githubUser;
    const pessoasFavoritas = [
      'juunegreiros', 'omariosouto', 
      'peas', 'rafaballerini', 
      'marcobrunodev', 'felipefialho'
    ];

    const [comunidades, setComunidades] = useState([]);

    const [seguidores, setSeguidores] = useState([]);

    
    useEffect(()=>{
      // api GITHUB
      fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((responseServidor)=>{
        return responseServidor.json();
      })
      .then((respostaCompleta)=>{
        setSeguidores(respostaCompleta);
      })

      //DATO CMS - GraphQL
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Authorization': '7a16147e28afa3201e3fcea985d3fc',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ "query": ` query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`})
      })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesDato);
      })
    }, [])


    return(
      <div className="home">
        <AlurakutMenu/>
        <MainGrid>
          <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSideBar githubUser={githubUser}/>
          </div>
          <div  className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <Box>
            <h1 className="title">Bem-Vindo(a)</h1>
            <OrkutNostalgicIconSet/>
            </Box>
            <Box>
              <h2 className="subTitle">O que você deseja fazer?</h2>
              
              <form onSubmit={function handleCriaComunidade(event){
                event.preventDefault();

                //captura tds os dados do form
                const dadosForm = new FormData(event.target);

                const comunidade = {
                  title: dadosForm.get('title'),
                  imageUrl: dadosForm.get('image'),
                  creatorSlug: dadosForm.get('creator')
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async(response)=>{
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  setComunidades([...comunidades, comunidade]);
                })
              }}>
                <div>
                  <input placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                  />
                </div>
                <div>
                  <input placeholder="URL para usar como capa"
                    name="image"
                    aria-label="URL para usar como capa"
                  />
                </div>
                <div>
                  <input placeholder="Nome do criador da comunidade"
                    name="creator"
                    aria-label="Nome do criador da comunidade"
                  />
                </div>
                <button>Criar comunidade</button>
              </form>
            </Box>
          </div>
          <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
            <ProfileRelationsBox title="Seguidores" items={seguidores}/>
              <ProfileRelationsBoxWrapper>
                <h2 className="subTitle">Comunidades ({comunidades.length})</h2>
                <ul>
                    {comunidades.map((comunidade) => {
                      return (
                        <li key={comunidade.id}>
                          <a href={`/comunities/${comunidade.id}`} >
                            <img src={comunidade.imageUrl} />
                            <span>{comunidade.title}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
              </ProfileRelationsBoxWrapper>
              <ProfileRelationsBoxWrapper>
                <h2 className="subTitle">Pessoas da comunidade ({pessoasFavoritas.length})</h2>
                <ul>
                  {pessoasFavoritas.map((pessoaFavorita) => {
                    return (
                      <li key={pessoaFavorita}>
                        <a href={`/users/${pessoaFavorita}`} >
                          <img src={`https://github.com/${pessoaFavorita}.png`} />
                          <span>{pessoaFavorita}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </ProfileRelationsBoxWrapper>
          </div>
        </MainGrid>
      </div>
    );
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context);  
  const token = cookies.USER_TOKEN ;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return{
    props: {
      githubUser
    }
  }

}
