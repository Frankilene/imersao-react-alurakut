
import { AlurakutProfileSidebarMenuDefault } from '../../lib/AlurakutCommons';
import Box from '../Box';

function ProfileSideBar(props){
    return(
      <Box as="aside">
        <img src={`https://github.com/${props.githubUser}.png`} alt="Foto de perfil do usuário" style={{borderRadius: '10px'}}/>
        <hr/>
        
        <a className="boxLink" href={`https://github.com/${props.githubUser}`} target="_blank">
          @{props.githubUser}
        </a>
        <hr/>
  
        <AlurakutProfileSidebarMenuDefault />
      </Box>
    );
}

export default ProfileSideBar;