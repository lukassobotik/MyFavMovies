const key = process.env.REACT_APP_TMDB_API_KEY;

const requests = {
    key: `${key}`,
    now_playing: `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1`,
    upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=2`,
    popular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=2`,
    trending_this_week: `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`
};

export const screenSizeGroups = {
    twoItems: 500,
    threeItems: 800,
    fourItems: 1000,
    fiveItems: 1400,
    sixItems: 1800
}

export const ratioGroups = {
    movieCast: 1.85
}

export default requests;