import React from 'react';

import logo from '../../../static/images/favicons/logo.png';

import FaceIcon from '@mui/icons-material/Face';
import Popover from '@mui/material/Popover';
import Chip from '@mui/material/Chip';
import LogoutIcon from '@mui/icons-material/Logout';
import { STANDARD_COLORS } from './colors';

const PROJECT_NAME = "WorldBabiesAI"

export default function Header(props: { email: string,  setMenuVisible : (visible: boolean) => void}) {

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <header className="z-10">
            <nav className="flex flex-col md:flex-row items-center border-b-medium border-b-1 border-b shadow-md justify-between p-2 tall:p-4 mx-auto lg:px-8" aria-label="Global">

                <div className="flex w-full md:max-w-[300px] lg:flex-1 flex-row justify-between items-center gap-4">
                    <div className="flex lg:hidden">
                        <button type="button" className="p-1 inline-flex items-center
          justify-between rounded-md p-2.5 text-base-content/90" onClick={() => props.setMenuVisible(true)}>
                            <span className="sr-only">Open main menu
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0
            24 24" strokeWidth="1.5" stroke="currentColor" className="w-6
            h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75
              6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <a href="#"
                        className="p-2 flex gap-2 md:gap-4 items-center text-sm">
                        <span className="sr-only">{PROJECT_NAME}
                        </span>
                        <img className="w-8 h-8 rounded-full bg-base-300"
                            src={logo} alt="LOGO" />
                        <h2 className="font-bold">
                            {PROJECT_NAME}
                        </h2>
                    </a>
                    <div className='lg:flex hidden  gap-2'>
                        <a href="/" className="text-sm font-semibold active
          leading-6 text-base-content link link-hover">Dashboard
                        </a>

                        <a href="/content/blog" className="text-sm
          leading-6 text-base-content link link-hover">Blog
                        </a>
                    </div>

                </div>

                <div className="header-account lg:block hidden ">
                    <Chip icon={<FaceIcon />} label={props.email} onClick={handleClick} variant="outlined" />
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        PaperProps={{
                            sx:
                            {
                                my: 0.5,
                                border: 1,
                                boxShadow: 1,
                                borderRadius: 2,
                                borderColor: STANDARD_COLORS["medium"],
                            }
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}

                    >
                        <div className="flex flex-col p-4 text-dark text-sm">
                            <span>Logged in as</span>
                            <span className="text-darkest text-bold">{props.email}</span>
                            <a href="/accounts/logout" className={"btn btn-primary gap-2  btn-sm my-2"}><span className="">Log out </span><LogoutIcon /></a>
                        </div>
                    </Popover>

                </div>
            </nav>
        </header >
    )

}