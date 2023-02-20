import { useState } from "react";
import { Helmet } from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import CharSearchForm from '../charSearchForm/CharSearchForm';

import decoration from '../../resources/img/vision.png';

const CharactersPage = () => {

    const [selectedCharacter, setCharacter] = useState(null);

    const onCharacterSelected = (id) => {
        setCharacter(id);
    }

    return ( 
        <>
            <Helmet> 
                <meta
                    name="description"
                    content="Page with Marvel characters info"
                />
                <title>Charcters page</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharacterSelected = {onCharacterSelected}/>
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo characterId={selectedCharacter}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm/>
                    </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default CharactersPage;