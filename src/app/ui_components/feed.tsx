'use client';

import { ReactNode, useState } from 'react';

interface RawRedditData extends Response {
    data: Record<string, string>;
}

interface RedditPost {
    title: string;
    author: string;
    permalink: string;
    num_comments: number;
    selftext_html?: string;
    url?: string;
}

interface RedditData {
    children: Array<{ data: RedditPost }>;
}

type FeedData = Record<string, RedditData>;

const redditUrl = 'https://www.reddit.com';

async function loadFeed(feeds: string[]): Promise<FeedData> {
    if (feeds.length === 0) {
        throw new TypeError('no feeds available to load');
    }

    let results: Record<string, RedditData> = {};

    for (let f of feeds) {
        const response = (await fetch(
            `${redditUrl}/r/${f}.json`,
            {}
        )) as RawRedditData;
        results[f] = (await response.json()).data;
    }

    console.log('got results', results);

    return results;
}

const buildPost = (post: RedditPost, index: number): ReactNode => {
    return (
        <div
            key={index}
            className="flex flex-col mt-2 border-y-2 border-yellow-100"
        >
            <a href={`${redditUrl}${post.permalink}`} target="_about">
                {post.title}
            </a>
            <div>by u/{post.author}</div>
            <span>commets: {post.num_comments}</span>
            {post.selftext_html && <div>{`${post.selftext_html}`}</div>}
            {post.url && (
                <a href={post.url} target="_about">
                    links out to: {post.url}
                </a>
            )}
        </div>
    );
};

const displayFeed = (feed: FeedData): React.ReactNode => {
    return (
        <div className="flex flex-col mt-10 border-t-2 border-white">
            {Object.keys(feed).map((topic) => {
                const posts = feed[topic].children;
                return (
                    <div key={topic} className="mt-4 border-t-2 border-t-white">
                        <h2>{topic}</h2>
                        {posts.map(({ data: post }, i) => buildPost(post, i))}
                    </div>
                );
            })}
        </div>
    );
};

type FeedState = 'empty' | 'loading' | 'filled';

export default function Feed() {
    const [topics, setTopics] = useState(['news', 'facepalm']);
    const [feeds, setFeeds] = useState({} as FeedData);
    const [state, setState] = useState('empty' as FeedState);

    return (
        <>
            <button
                className="mt-2 bg-red-800 px-4 py-2 rounded-3xl"
                onClick={() => loadFeed(topics).then((f) => setFeeds(f))}
            >
                Load Feed
            </button>
            {(feeds && displayFeed(feeds)) || <div>Feed Empty</div>}
        </>
    );
}
