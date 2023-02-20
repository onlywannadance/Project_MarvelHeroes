import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelServices';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

    const [character, setCharacter] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateCharacter()
    }, [props.characterId])

    const updateCharacter = () => {
        const {characterId} = props;
        if (!characterId) {
            return;
        }

        clearError();
        getCharacter(characterId)
            .then(onCharacterLoaded) 
            .then(() => setProcess('confirmed'))      // только после того как загрузится персонаж, процесс перейдет в состоянние confirmed ЧЕРЕЗ КОЛ БЭК!
    }

    const onCharacterLoaded = (character) => {
        setCharacter(character);
    }

    // 1 ВАРИАНТ - СЛАБЫЙ ПАТЕРН
    
    // const skeleton = character || loading || error ? null : <Skeleton/>;
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(loading || error || !character) ? <View character={character}/> : null;

    // return (
    //     <div className="char__info">
    //         {skeleton}
    //         {errorMessage}
    //         {spinner}
    //         {content}
    //     </div>
    // 

    // 2 ВАРИАНТ - ПРАВИЛЬНЫЙ ПАТЕРН + utils setContent
    return (
        <div className="char__info">
            {setContent (process, View, character)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }                
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    characterId: PropTypes.number
}

export default CharInfo;