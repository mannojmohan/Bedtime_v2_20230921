import React from 'react';

import {
    NavLink,
} from 'react-router-dom';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import HomeIcon from '@mui/icons-material/Home';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

function NavBarLink({ path, label, icon, expanded }: { path: string, label: string, icon: any, expanded: boolean }) {

    const classesCommon = "text-white py-2 px-4 flex gap-2"
    const classesActive = " underline underline-offset-4 decoration-lightest decoration-4 flex hover:text-medium"
    const classesInactive = " text-lightest hover:underline hover:underline-offset-4 hover:decoration-lightest hover:decoration-4 "
    return <li><NavLink className={({ isActive }: { isActive: boolean }) => isActive ? classesCommon + classesActive : classesCommon + classesInactive} to={path}>
        {icon} {expanded ? label : ''}</NavLink></li>;
}


export default function Sidebar() {
    const [expanded, setExpanded] = React.useState(true);

    return (
        <nav className={'sidenav ease-in-out duration-300 hidden text-white lg:block bg-primary border-r-1 border-r-medium py-8 border-r ' + (expanded ?  'w-[180px]' : 'w-[54px]')}>
            
            <ul className=''>
            {expanded ? (
                <button className='px-4 pb-4' onClick={() => setExpanded(false)}><KeyboardDoubleArrowLeftIcon /></button>
            ): ( <button className='px-4 pb-4' onClick={() => setExpanded(true)}><KeyboardDoubleArrowRightIcon /></button>)}
                <NavBarLink expanded={expanded} path='' label="Home" icon={<HomeIcon/>}/>
                <NavBarLink expanded={expanded} path='books' label="Books"  icon={<AutoStoriesIcon />}/>
                <NavBarLink expanded={expanded} path='recordings' label="Recordings"  icon={<RecordVoiceOverIcon/>} />
                
            </ul>
        </nav>
    );
}

