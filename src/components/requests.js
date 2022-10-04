const key = '4a819538b0779358ef8be1dd6afe63a3';

const requests = {
    latest: `https://api.themoviedb.org/3/movie/latest?api_key=${key}&language=en-US`,
    upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=2`,
    popular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=2`
};

export default requests;