import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner />
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


const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);
 
     const {getAllComics, process, setProcess} = useMarvelService();

     useEffect( () => {
        onRequest(offset, true);
     }, [])   

     const onRequest = (offset, initial) => { 
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded) 
            .then(() => setProcess('confirmed')) ;
    }                                                 // хук для реализации обновления компонента
         

     const onComicsListLoaded = (newComicsList) => {

        let ended = false;
        if (newComicsList.length < 8) {
            ended = true
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setComicsEnded(ended);

     }

     const itemRefs = useRef([]);                      // useRef можно использовать исключительно на верхнем уровне

     const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('comics__item_selected'));          // внутри itemRefs лежит массив внутри свойство current, который перебирается, у каждого элемента убирается класс
        itemRefs.current[id].classList.add('comics__item_selected');
        itemRefs.current[id].focus();
     }

     function renderItems(arr) {
        const items =  arr.map((item, i) => {
            
            return (
                <li 
                    className="comics__item"
                    ref={el => itemRefs.current[i] = el}
                    key={i}
                    onClick={() => {
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onComicsSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                >
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        // Эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul> 
        )
     }
    
        
        //const items = renderItems(comicsList); 

        return (
            <div className="comics__list">
                {setContent(process, () => renderItems(comicsList), newItemLoading)}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicsEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

export default ComicsList;