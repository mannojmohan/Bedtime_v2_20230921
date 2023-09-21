

import React from 'react';


export default function Footer() {
    return (

        <footer className="h-30 hidden tall:visible flex flex-end py-4 bg-base-200 text-base-content justify-left text-sm text-dark bg-lightest border-t-medium border-t-1">
            <div className="flex justify-left gap-8 px-8">
                <div className='flex flex-col'>
                    <a className=" underline" href="#feedback">Feedback
                    </a>
                </div>
            </div>
        </footer>
    );
}