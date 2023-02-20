import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>
            break;  
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>
            break;
        case 'confirmed':
            return <Component/>
            break;
        case 'error':
            return <ErrorMessage/>
            break; 
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [characterList, setCharacterList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210); 
    const [characterEnded, setCharacterEnded] = useState(false);
 
     const {getAllCharacters, process, setProcess} = useMarvelService();

     useEffect( () => {
        onRequest(offset, true);
     }, [])   

     const onRequest = (offset, initial) => { 
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllCharacters(offset)     
            .then(onCharacterListLoaded)
            .then(() => setProcess('confirmed')); 
    }                                                 // хук для реализации обновления компонента
         

     const onCharacterListLoaded = (newCharacterList) => {

        let ended = false;
        if (newCharacterList.length < 9) {
            ended = true
        }

        setCharacterList([...characterList, ...newCharacterList]);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setCharacterEnded(ended); 

     }

     const itemRefs = useRef([]);                      // useRef можно использовать исключительно на верхнем уровне

     const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));          // внутри itemRefs лежит массив внутри свойство current, который перебирается, у каждого элемента убирается класс
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
     }

     function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharacterSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharacterSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        // Эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul> 
        )
     } 
    
        
        // const items = renderItems(characterList); 

        return (
            <div className="char__list">
                {setContent(process, () => renderItems(characterList), newItemLoading)}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': characterEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

CharList.propTypes = {
    onCharacterSelected: PropTypes.func.isRequired
}

export default CharList;