import * as React from 'react';


export default function RecordingMessage({ content, visible }: { content: React.ReactNode, visible: boolean }) {
    return (
        <div className={"relative z-10 " + (visible ? "" : " hidden")} >

            <div className="fixed inset-0 bg-red-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div className="relative transform overflow-hidden rounded-lg  sm:my-8 sm:w-full sm:max-w-md sm:p-12 bg-white lg:p-24 lg:px-24 lg:py-24 text-left shadow-xl transition-all">
                        <div>
                            <div className="my-3 text-center text-2xl">
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
