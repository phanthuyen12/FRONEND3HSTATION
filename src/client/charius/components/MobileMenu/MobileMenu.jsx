import React, { Fragment, useState } from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Collapse from "@mui/material/Collapse";
import { NavLink } from "react-router-dom";
import './style.css';

const menus = [
    {
        id: 1,
        title: 'Home',
        link: '/home',
        submenu: [
            {
                id: 11,
                title: 'Home style 1',
                link: '/'
            },
            {
                id: 12,
                title: 'Home style 2',
                link: '/home-2'
            },
            {
                id: 13,
                title: 'Home style 3',
                link: '/home-3'
            },
            {
                id: 14,
                title: 'Home style 4',
                link: '/home-4'
            }
        ]
    },
   
    {
        id: 3,
        title: 'Pages',
        link: '/',
        submenu: [
            {
                id: 30,
                title: 'About',
                link: '/about',
            },
            {
                id: 31,
                title: 'Gallery',
                link: '/gallery',
            },
            {
                id: 32,
                title: 'Testimonial',
                link: '/testimonial',
            },
            {
                id: 33,
                title: 'Causes Style 1',
                link: '/causes',
            },
            {
                id: 34,
                title: 'Causes Style 2',
                link: '/causes-s2',
            },
            {
                id: 35,
                title: 'Causes Style 3',
                link: '/causes-s3',
            },
            {
                id: 36,
                title: 'Causes Single',
                link: '/causes-single/1',
            },
            {
                id: 37,
                title: 'Volunteer',
                link: '/volunteer',
            },
            {
                id: 38,
                title: 'Volunteer Single',
                link: '/volunteer-single',
            },
            {
                id: 39,
                title: 'Service',
                link: '/service',
            },
            {
                id: 310,
                title: 'Service Single',
                link: '/service-single/1',
            },
            {
                id: 310,
                title: '404 Error',
                link: '/404',
            },
        ]
    },
    {
        id: 4,
        title: 'Donations',
        link: '/donate',
    },

    {
        id: 5,
        title: 'Events',
        link: '/events',
        submenu: [
            {
                id: 51,
                title: 'Events',
                link: '/event',
            },
           
            {
                id: 52,
                title: 'Events single',
                link: '/event-single/1'
            },
          
        ]
    },

    {
        id: 6,
        title: 'Blog',
        link: '/blog',
        submenu: [
            {
                id: 61,
                title: 'Blog',
                link: '/blog'
            },
            {
                id: 62,
                title: 'Blog Left sidebar',
                link: '/blog-left-sidebar'
            },
            {
                id: 63,
                title: 'Blog full width',
                link: '/blog-fullwidth'
            },
            {
                id: 64,
                title: 'Blog single',
                link: '/blog-single/1'
            },
            {
                id: 65,
                title: 'Blog single Left sidebar',
                link: '/blog-single-left-sidebar/1'
            },
            {
                id: 66,
                title: 'Blog single Left sidebar',
                link: '/blog-single-fullwidth/1'
            },
        ]
    },
    {
        id: 88,
        title: 'Contact',
        link: '/contact',
    }


]


const MobileMenu = () => {

    const [openId, setOpenId] = useState(0);
    const [menuActive, setMenuState] = useState(false);

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">
                    {menus.map((item, mn) => {
                        return (
                            <ListItem className={item.id === openId ? 'active' : null} key={mn}>
                                {item.submenu ?
                                    <Fragment>
                                        <p onClick={() => setOpenId(item.id === openId ? 0 : item.id)}>{item.title}
                                            <i className={item.id === openId ? 'fa fa-angle-up' : 'fa fa-angle-down'}></i>
                                        </p>
                                        <Collapse in={item.id === openId} timeout="auto" unmountOnExit>
                                            <List className="subMenu">
                                                <Fragment>
                                                    {item.submenu.map((submenu, i) => {
                                                        return (
                                                            <ListItem key={i}>
                                                                <NavLink onClick={ClickHandler} className="active"
                                                                    to={submenu.link}>{submenu.title}</NavLink>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </Fragment>
                                            </List>
                                        </Collapse>
                                    </Fragment>
                                    : <NavLink className="active"
                                        to={item.link}>{item.title}</NavLink>
                                }
                            </ListItem>
                        )
                    })}
                </ul>

            </div>

            <div className="showmenu mobail-menu" onClick={() => setMenuState(!menuActive)}>
                <button type="button" className="navbar-toggler open-btn">
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
        </div>
    )
}

export default MobileMenu;