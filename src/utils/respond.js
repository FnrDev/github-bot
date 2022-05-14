export const respond = (body) => {
    return new Response(JSON.stringify(body), {
        headers: {
            'content-type': 'application/json'
        }
    });
}