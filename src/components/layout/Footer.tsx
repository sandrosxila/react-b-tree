import React from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { themeParams } from '../../constants/constants';
import { RootState } from '../..';

const Footer = () => {

    const themeIndex = useSelector((state: RootState) => state.theme);

    const { themeType } = themeParams[themeIndex];

    const footerStyle: React.CSSProperties = {
        position: 'fixed',
        left: '0',
        bottom: '1.2em',
        height: '1.4em',
        width: '100%',
        textAlign: 'center',
        color: themeType === 'light' ? '#212529' : '#f8f9fa'
    };

    return (
        <div style={ footerStyle }>
            <p>
                Created With { ' ' }
                <FontAwesomeIcon icon={ faHeart }/> { ' ' }
                By { ' ' }
                <a href="https://github.com/sandrosxila">
                    Sandro Skhirtladze
                </a>
            </p>
        </div>
    );
};

export default Footer;