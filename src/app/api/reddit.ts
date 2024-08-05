'use server';

const baseUrl = 'https://www.reddit.com/r/';

export default async function requestFeeds(...params: any) {
    console.log('called with params', params);
    const response = await fetch(`${baseUrl}news.json`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('response', response);
    const result = await response.json();
    return result;
}