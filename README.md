# MyFavMovies
[**MyFavMovies**](https://puckyeu.github.io/MyFavMovies/) is a website, which is made for you to **Discover** what movies or tv shows you would want to watch. It is in a streaming service like fashion, and all results will be **Personalized** depending on **Your Ratings** of previous movies. The website will contain every bit of information you would **need** or **want** to know about the movie like **Release Dates, Cast, Crew** and so on.

## How to clone this repository

### Prerequisites
* NodeJS and npm - [Download & Install NodeJS and npm](https://nodejs.org/en/download/)
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

Once you clone this repository, run `npm install` to download all the required plugins

1. In the root of this repository, create a new file named `.env`
2. In the file, add these keywords:
```env
REACT_APP_VERSION=$npm_package_version
REACT_APP_API_KEY=''
REACT_APP_AUTH_DOMAIN=''
REACT_APP_PROJECT_ID=''
REACT_APP_STORAGE_BUCKET=''
REACT_APP_MESSAGING_SENDER_ID=''
REACT_APP_APP_ID=''
REACT_APP_MEASUREMENT_ID=''
REACT_APP_TMDB_API_KEY=''
```
In between the apostrophes, add your Firestore Database and TMDb API Keys. Leave the `REACT_APP_VERSION` as it is.

For more info, checkout the [Documentation](https://github.com/PuckyEU/MyFavMovies/wiki)

## Plans for the future
#### v0.7.0:
- [x] Actor Page
#### v0.8.0:
- [x] Website Footer
- [x] Movie Searching
#### v0.9.0:
- [x] TV Page
#### v1.0.0 (Should be finished until the end of the year):
- [x] Movie & Actor Lists
- [ ] Movie Recommendations

#### [Documentation](https://github.com/PuckyEU/MyFavMovies/wiki) ~ [Donate](https://www.buymeacoffee.com/puckyeu)
