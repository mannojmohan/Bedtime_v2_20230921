import React from 'react';

import logo from '../../../static/images/favicons/logo.png';

import LogoutIcon from '@mui/icons-material/Logout';

import {
    NavLink,
} from 'react-router-dom';



export default function MobileMenu({ email, menuVisible, setMenuVisible }: { email: string, menuVisible: boolean, setMenuVisible : (visible: boolean) => void }) {
    
    function NavBarLink({ path, label }: { path: string, label: string }) {
        return <li><NavLink onClick={() => setMenuVisible(false) } className={({ isActive }: { isActive: boolean }) => isActive ? 'py-2 px-8 font-bold underline underline-offset-4 decoration-lightest decoration-4 flex hover:font-bold hover:text-darkest' : 'flex py-2 px-8 hover:underline hover:underline-offset-4 hover:decoration-lightest hover:decoration-4 '} to={path}>{label}</NavLink></li>;
    }
    
    return (
        <div className={"relative z-50 text-center "}  id="menu-mobile" data-theme="light">
            <div className={`top-0 left-0 fixed inset-y-0 left-0 z-10 w-full px-6 py-6
overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 shadow-md border-r-medium border-r-1
        sm:ring-neutral/10 transform origin-left transition duration-300 ease-in-out
         ` + (menuVisible ? " translate-x-0 " : " translate-x-[-100%]")}>
                <div className="flex items-center justify-between">
                    
                    <button type="button" className="-m-2.5 rounded-md p-2.5
            text-base-content/80" id="close-menu-mobile" onClick={() => setMenuVisible(false)}>
                        <span className="sr-only">Close menu
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0
              0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6
              h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6
                18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button>
                    <a href="#" aria-label="home" className="-m-1.5 p-1.5">
                        <span className="sr-only">WorldBabiesAI
                        </span>
                        <img className="w-8 h-8 rounded-full bg-base-300"
                            src={logo} alt="LOGO" />
                    </a>
                </div>
                <div className="flow-root mt-6">
                    <ul className='flex flex-col items-center'>
                        <NavBarLink path='' label="Home" />
                        <NavBarLink path='books' label="Books" />
                        <NavBarLink path='recordings' label="Recordings" />
                    </ul>

                    <div>
                        <div className="flex flex-col p-4 text-dark text-sm">
                            <span><span>Logged in as </span>
                                <span className="text-darkest text-bold">{email}</span></span>
                            <a href="/accounts/logout" className={"btn btn-primary gap-2  btn-sm my-2"}><span className="">Log out </span><LogoutIcon /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}