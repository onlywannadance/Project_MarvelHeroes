import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {

    const {error, loading, request, clearError, process, setProcess} = useHttp(); 

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=12c0bbdec6465be58ea1ed6dfcd46271';
    const _baseOffset = 210;


    // Получение персонажей

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const checkDescription = (description) => {
        if (description) {
            if (description.length > 210) {
                return description.slice(0,210) + '...';
            }
            else {
                return description;
            }
        }
        else {
            return 'Description not found'
        }
    }


    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: checkDescription(character.description),
            thumbnail: character.thumbnail.path + '.' + 
                       character.thumbnail.extension,
            homepage:  character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }

    // Получение коммиксов

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description ? `${comic.description}` : `Description not found`,
            pageCount: comic.pageCount ? `${comic.pageCount} pages` : `No info about pages count`,
            thumbnail: comic.thumbnail.path + '.' + 
                       comic.thumbnail.extension,
            language: comic.textObjects.language || 'en-us',
            price: comic.price ? `${comic.price}$` : `Not available`
        }
    }

    return {getCharacter,  
            error,
            loading,
            clearError,
            process,
            setProcess,
            getAllComics,
            getAllCharacters,
            getComic,
            getCharacterByName}
}

export default useMarvelService;