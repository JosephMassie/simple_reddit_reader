'use client';

import { useState } from 'react';
import Feed from './ui_components/feed';
import Manager from './ui_components/manager';
import { Button } from './ui_components/general';

type AppState = 'view' | 'manage';

export default function Home() {
    const [state, setState] = useState('manage' as AppState);
    const [topics, setTopics] = useState(['news', 'facepalm']);

    return (
        <main
            role="main"
            className="h-screen overflow-y-auto bg-slate-600 m-0 text-white pt-10 px-[15px]"
        >
            <div
                className="sm:container min-h-[500px] mx-auto flex flex-col sm:grid gap-y-[20px]"
                style={{
                    gridTemplateColumns: '20% 80%',
                    gridTemplateRows: 'min-content',
                }}
            >
                <div className="col-span-2">
                    <h1 className="text-center text-3xl">
                        Simple Reddit Reader
                    </h1>
                </div>
                <div className="flex sm:flex-col bg-gray-500 p-4 rounded-l-xl">
                    <Button
                        onClick={() => setState('view')}
                        className="mx-auto sm:mb-4"
                    >
                        Feed
                    </Button>
                    <Button
                        onClick={() => setState('manage')}
                        className="mx-auto"
                    >
                        Manage
                    </Button>
                </div>
                <div className="relative bg-slate-800 rounded-r-xl p-4">
                    {state === 'view' && <Feed topics={topics} />}
                    {state === 'manage' && (
                        <Manager
                            topics={topics}
                            updateTopics={(newTopics) => setTopics(newTopics)}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
