'use client';

import { ReactNode, useState } from 'react';
import { Button, LoadingWheel } from './general';

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
        <>
            {Object.keys(feed).map((topic, i) => {
                const posts = feed[topic].children;
                return (
                    <div key={i} className="mt-4 border-t-2 border-t-white">
                        <h2>{topic}</h2>
                        {posts.map(({ data: post }, i) => buildPost(post, i))}
                    </div>
                );
            })}
        </>
    );
};

type FeedState = 'empty' | 'loading' | 'filled';

export default function Feed({ topics = ['news'] }: { topics?: string[] }) {
    const [feeds, setFeeds] = useState({} as FeedData);
    const [state, setState] = useState('empty' as FeedState);

    // Perform a single initial load
    if (topics.length > 0 && state === 'empty') {
        setState('loading');
        loadFeed(topics).then((f) => {
            setState('filled');
            setFeeds(f);
        });
    }

    return (
        <>
            <Button
                className="relative mt-2 mx-auto sm:mx-0"
                disabled={topics.length === 0}
                onClick={() => {
                    setState('loading');

                    loadFeed(topics).then((f) => {
                        setState('filled');
                        setFeeds(f);
                    });
                }}
            >
                Load Feed
            </Button>
            <div className="flex flex-col mt-8 pt-4 border-t-2 border-white">
                {state === 'empty' && (
                    <div className="text-3xl">Feed is empty</div>
                )}
                {state === 'loading' && <LoadingWheel />}
                {state === 'filled' && displayFeed(feeds)}
            </div>
        </>
    );
}
