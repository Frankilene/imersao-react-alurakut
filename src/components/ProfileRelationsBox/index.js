import { ProfileRelationsBoxWrapper } from '../ProfileRelations';


function ProfileRelationsBox(props){
    return(
      <ProfileRelationsBoxWrapper>
        <h2 className="subTitle">{props.title} ({props.items.length})</h2>
        <ul>
          {/*pessoasFavoritas.map((pessoaFavorita) => {
            return (
              <li key={pessoaFavorita}>
                <a href={`/users/${pessoaFavorita}`} >
                  <img src={`https://github.com/${pessoaFavorita}.png`} />
                  <span>{pessoaFavorita}</span>
                </a>
              </li>
            )
          })*/}
        </ul>
      </ProfileRelationsBoxWrapper>
    );
}

export default ProfileRelationsBox;