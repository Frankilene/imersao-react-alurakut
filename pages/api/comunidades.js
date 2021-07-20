import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(req, res){
    if(req.method === 'POST'){
        const TOKEN = 'de179881df0d4b143de94060cc8a5e';

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "967065",
            ...req.body,
            //title: "Comunidade teste",
            //imageUrl: "https://github.com/Frankilene.png",
            //creatorSlug: "frankilene"
        })

        res.json({
            dados: " dado aleatório",
            registroCriado: registroCriado,
        })
        return;
    }

    return res.status(404).json({message: 'Ainda não temos nada no GET, mas no POST tem'});

}