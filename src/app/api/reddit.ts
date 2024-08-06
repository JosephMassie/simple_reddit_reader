'use server'

const baseUrl = 'https://www.reddit.com/r/'

export interface RedditData extends Response {
    data: Record<string, string>;
};

export default async function requestFeeds(...params: any) {
    console.log('called with params', params)
    const response = (await fetch(`${baseUrl}news.json`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    })) as RedditData
    console.log('response', { status: response.status, statusText: response.statusText})
    //const result = await response.json();
    return Object(response.data)
}
