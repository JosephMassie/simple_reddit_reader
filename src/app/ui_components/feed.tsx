'use client'

import { useState } from 'react';
import requestFeeds from '../api/reddit';

async function loadFeed(feeds: string[]) {
    if (feeds.length === 0) {
        throw new TypeError('no feeds available to load')
    }

    let results: Record<string, any> = {}

    for (let f of feeds) {
        results[f] = requestFeeds(f);
    }

    return results
}

export default function Feed() {
    const [feeds, setFeeds] = useState(['news'])

    return <div>
        Feed
        <button onClick={() => loadFeed(feeds)}>test</button>
    </div>
}
