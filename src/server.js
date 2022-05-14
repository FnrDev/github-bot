import { Router } from 'itty-router';
import { verifyKey } from 'discord-interactions';
import {
    InteractionType,
    InteractionResponseType,
    MessageFlags
} from 'discord-api-types/v10';
import { respond } from './utils/respond';


const router = Router();

router.get('/', (request, env) => {
    return new Response(`👋 ${env.CLIENT_ID} endpoint`);
});


router.post('/', async (request, env) => {
    const interaction = await request.json();

    if (interaction.type === InteractionType.Ping) {
        return respond({
            type: InteractionResponseType.Pong,
        });
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.data.name === 'invite') {
            return respond({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: '[Click here to invite](https://discord.com/api/oauth2/authorize?client_id=931144143592378399&permissions=0&scope=bot%20applications.commands)',
                    flags: MessageFlags.Ephemeral
                }
            })
        }
    }
})

export default {
    async fetch(request, env) {
        if (request.method === 'POST') {
            const signature = request.headers.get('x-signature-ed25519');
            const timestamp = request.headers.get('x-signature-timestamp');
            const body = await request.clone().arrayBuffer();
            const isValidRequest = verifyKey(
                body,
                signature,
                timestamp,
                env.PUBLIC_KEY
            );
            if (!isValidRequest) {
                console.error('Invalid Request');
                return new Response('Bad Request signature', { status: 401 });
            }
        }
        
        return router.handle(request, env);
    }
}