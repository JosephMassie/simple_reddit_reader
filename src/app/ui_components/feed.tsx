'use client';

import { ReactNode, useState } from 'react';
import { Button, LoadingWheel } from './general';
import sanitizeHtml from 'sanitize-html';

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

function parseHtml(a_html: string) {
    if (typeof a_html !== 'string') return '';
    const html = a_html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");
    console.log('parsed', html);

    return html;
}

const createMarkup = (unsafeHtml: string) => ({
    __html: unsafeHtml,
});

const buildPost = (post: RedditPost, index: number): ReactNode => {
    const linkToPost = `${redditUrl}${post.permalink}`;

    return (
        <div
            key={index}
            className="mt-2 p-3 border-2 rounded-md border-red-900 bg-red-900 grid gap-2"
            style={{
                gridTemplateColumns: 'min-content 1fr',
                gridTemplateRows: 'min-content min-content 1fr',
            }}
        >
            <a
                href={linkToPost}
                target="_about"
                className="font-bold text-xl col-span-2 leading-4"
            >
                {post.title}
            </a>
            <div className="whitespace-nowrap text-xs">
                <span className="font-semibold">By:</span> u/{post.author}
            </div>
            <div className="text-xs">
                <span className="font-semibold">Comments:</span>
                {` ${post.num_comments}`}
            </div>
            {post.url && post.url !== linkToPost && (
                <div className="col-span-2 whitespace-nowrap overflow-hidden">
                    <a
                        href={post.url}
                        target="_about"
                        className="block max-w-full overflow-hidden overflow-ellipsis"
                    >
                        {post.url}
                    </a>
                </div>
            )}
            {post.selftext_html && (
                <div
                    className="px-4 col-span-2"
                    dangerouslySetInnerHTML={createMarkup(
                        sanitizeHtml(parseHtml(post.selftext_html))
                    )}
                ></div>
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
                    <div key={i} className="mt-4 p-2 bg-gray-400 rounded-xl">
                        <h2 className="text-4xl text-black font-bold">
                            r/{topic}
                        </h2>
                        <div>
                            {posts.map(({ data: post }, i) =>
                                buildPost(post, i)
                            )}
                        </div>
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
                Reload Feed
            </Button>
            <div className="flex flex-col mt-4">
                {state === 'empty' && (
                    <div className="text-3xl">Feed is empty</div>
                )}
                {state === 'loading' && <LoadingWheel />}
                {state === 'filled' && displayFeed(feeds)}
            </div>
        </>
    );
}
