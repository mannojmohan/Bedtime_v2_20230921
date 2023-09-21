import React from 'react'
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.error?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = 'Unknown error';
    }

    console.error(error);

    return (
        <div className='h-screen w-full flex text-center'>
            <div id="error-page" className='flex flex-col max-w-[500px] h-40 m-auto'>
                <h1 className='text-2xl mb-2'>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p className='my-2'>
                    <i className='italic font-bold'>{errorMessage}</i>
                </p>
            </div>
        </div>

    );
}