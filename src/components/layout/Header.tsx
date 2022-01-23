import React, { useEffect, useState, useRef, FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { insert, initialize, erase, undo, redo } from '../../actions/index';
import { findElement } from '../../functions/motorics';
import { range } from '../../functions/helpers';
import useMeasure from 'react-use-measure';
import ThemePicker from './ThemePicker';
import { themeParams } from '../../constants/constants';
import useWindowSize from '@rooks/use-window-size';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faSearch, faEraser, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../..';

type Props = {
    headerHeightSetter: React.Dispatch<React.SetStateAction<number>>
}

const Header: FC<Props> = props => {

    const { headerHeightSetter } = props;

    const dispatch = useDispatch();
    const themeIndex = useSelector((state: RootState) => state.theme);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectValue, setSelectValue] = useState('Degree');
    const levels = useSelector((state: RootState) => state.tree);
    const optionValues = range({ start: 3, stop: 10 });
    const [ref, bounds] = useMeasure();


    const {
        navBarClass,
        insertButtonClass,
        eraseButtonClass,
        findButtonClass,
        clearButtonClass,
        undoButtonClass,
        redoButtonClass,
        inputClass,
        mobileInputClass
    } = themeParams[themeIndex];

    const { innerWidth } = useWindowSize();

    const isTablet = useMemo(() => innerWidth !== null && innerWidth < 1000, [innerWidth]);
    const isMobile = useMemo(() => innerWidth !== null && innerWidth < 664, [innerWidth]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onInsertButtonClick();
    };

    const onInsertButtonClick = () => {
        if (inputValue.length > 0) {
            dispatch(insert(inputValue));
        }
        setInputValue('');
    };

    const onEraseButtonClick = () => {
        if (inputValue.length > 0)
            dispatch(erase(inputValue));
        setInputValue('');
        if(inputRef.current)
            inputRef.current.focus();
    };

    const onFindButtonClick = () => {
        if (inputValue.length > 0)
            findElement(isNaN(Number(inputValue)) ? inputValue : parseFloat(inputValue), levels);
        setInputValue('');
    };

    const onClearButtonClick = () => {
        dispatch(initialize(selectValue === 'Degree' ? '5' : selectValue));
    };

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectValue(e.target.value);
    };

    const onUndoButtonClick = () => {
        dispatch(undo());
    };

    const onRedoButtonClick = () => {
        dispatch(redo());
    };

    //this effect will be invoked as we change the value of degree in dropdown menu
    useEffect(() => {
        dispatch(initialize(selectValue));
    }, [selectValue, dispatch]);

    useEffect(() => {
        headerHeightSetter(bounds.height);
    }, [bounds, headerHeightSetter]);

    const mobileButton = {
        width: '2em',
        height: '2em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const mobileDivStyle = {
        flexDirection: 'column',
        flexBasis: '100%'
    };

    return (
        <div ref={ ref }>
            <nav className={ navBarClass }>
                {
                    !isTablet
                    &&
                        <a className="navbar-brand" href="." onClick={ e => e.preventDefault() }>B-tree Visualization</a>
                }
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {
                        !isMobile && (
                            <>
                                <form className="form-inline d-inline-flex navbar-nav mr-auto" onSubmit={ onSubmit }>
                                    <div>
                                        <input id="input" className={ inputClass } type="text"
                                            aria-label="Insertion" value={ inputValue } ref={ inputRef }
                                            onChange={ onInputChange }/>
                                        { /*insertion*/ }
                                        {
                                            isTablet ? (
                                                <button className={ insertButtonClass } onClick={ onInsertButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faPlus } transform={ 'shrink-1' }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ insertButtonClass } onClick={ onInsertButtonClick }>
                                                        Insert
                                                    </button>
                                                )
                                        }
                                        { /*deletion*/ }
                                        {
                                            isTablet ? (
                                                <button className={ eraseButtonClass } onClick={ onEraseButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faTimes }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ eraseButtonClass } onClick={ onEraseButtonClick }>
                                                        Erase
                                                    </button>
                                                )
                                        }
                                        { /*find*/ }
                                        {
                                            isTablet ? (
                                                <button className={ findButtonClass } onClick={ onFindButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faSearch }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ findButtonClass } onClick={ onFindButtonClick }>
                                                        Find
                                                    </button>
                                                )
                                        }
                                        { /*clear*/ }
                                        {
                                            isTablet ? (
                                                <button className={ clearButtonClass } onClick={ onClearButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faEraser }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ clearButtonClass } onClick={ onClearButtonClick }>
                                                        Clear
                                                    </button>
                                                )
                                        }
                                        <select id="degree" className="custom-select custom-select-sm"
                                            value={ selectValue }
                                            onChange={ onSelectChange }>
                                            <option className="dropdown-item" value="Degree" disabled={ true } hidden={ true }>
                                                Degree
                                            </option>
                                            {
                                                optionValues.map((degree, index) => (
                                                    <option className="dropdown-item" value={ `${degree}` } key={ index }>
                                                        { degree }
                                                    </option>
                                                )
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        {
                                            isTablet ? (
                                                <button className={ undoButtonClass } onClick={ onUndoButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faArrowLeft } transform={ 'shrink-1' }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ undoButtonClass } onClick={ onUndoButtonClick }>
                                                        <i>
                                                            Undo
                                                        </i>
                                                    </button>
                                                )
                                        }
                                        {
                                            isTablet ? (
                                                <button className={ redoButtonClass } onClick={ onRedoButtonClick }
                                                    style={ mobileButton }>
                                                    <FontAwesomeIcon icon={ faArrowRight } transform={ 'shrink-1' }/>
                                                </button>
                                            )
                                                : (
                                                    <button className={ redoButtonClass } onClick={ onRedoButtonClick }>
                                                        <i>
                                                            Redo
                                                        </i>
                                                    </button>
                                                )
                                        }
                                    </div>
                                </form>
                                <div className="navbar-nav ml-auto">
                                    <div className="mx-1">
                                        <ThemePicker/>
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {
                        isMobile && (
                            <div className="d-flex" style={ mobileDivStyle as React.CSSProperties }>
                                <div className="d-flex justify-content-between py-1">
                                    <span>
                                        <button className={ undoButtonClass } onClick={ onUndoButtonClick }
                                            style={ mobileButton }>
                                            <FontAwesomeIcon icon={ faArrowLeft } transform={ 'shrink-1' }/>
                                        </button>
                                        { /*redo*/ }
                                        <button className={ redoButtonClass } onClick={ onRedoButtonClick }
                                            style={ mobileButton }>
                                            <FontAwesomeIcon icon={ faArrowRight } transform={ 'shrink-1' }/>
                                        </button>
                                    </span>
                                    <span>
                                        <div className="navbar-nav ml-auto">
                                            <div className="m-1">
                                                <ThemePicker/>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <form onSubmit={ onSubmit }>
                                    <input id="input" className={ mobileInputClass } type="text"
                                        aria-label="Insertion" value={ inputValue } ref={ inputRef }
                                        onChange={ onInputChange }/>
                                </form>
                                <div className="d-flex justify-content-between py-1">
                                    <span className="d-flex align-items-center">
                                        { /*insertion*/ }
                                        <button className={ insertButtonClass } onClick={ onInsertButtonClick }
                                            style={ mobileButton } type={ 'submit' } form="mobile-form">
                                            <FontAwesomeIcon icon={ faPlus } transform={ 'shrink-1' }/>
                                        </button>
                                        { /*deletion*/ }
                                        <button className={ eraseButtonClass } onClick={ onEraseButtonClick }
                                            style={ mobileButton }>
                                            <FontAwesomeIcon icon={ faTimes }/>
                                        </button>
                                        { /*find*/ }
                                        <button className={ findButtonClass } onClick={ onFindButtonClick }
                                            style={ mobileButton }>
                                            <FontAwesomeIcon icon={ faSearch }/>
                                        </button>
                                        { /*clear*/ }
                                        <button className={ clearButtonClass } onClick={ onClearButtonClick }
                                            style={ mobileButton }>
                                            <FontAwesomeIcon icon={ faEraser }/>
                                        </button>
                                    </span>
                                    <span>
                                        <select id="degree" className="custom-select custom-select-sm"
                                            value={ selectValue }
                                            onChange={ onSelectChange }>
                                            <option className="dropdown-item" value="Degree" disabled={ true } hidden={ true }>
                                                Degree
                                            </option>
                                            {
                                                optionValues.map((degree, index) => (
                                                    <option className="dropdown-item" value={ `${degree}` } key={ index }>
                                                        { degree }
                                                    </option>
                                                )
                                                )
                                            }
                                        </select>
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </nav>
        </div>
    );
};

export default Header;
