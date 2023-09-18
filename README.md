<p align="center">
<img style="align:center;" src="./public/favicon.ico" alt="" width="100" />
</p>

<h1 align="center">MyFavMovies</h1>
<h3 align="center">Personalized Streaming, All-in-One Movie Info</h3>
<p align="center">
<a href="https://myfavmovies.lukassobotik.dev/">Try It Out!</a> | <a href="https://www.buymeacoffee.com/lukassobotik">Support Me</a> | <a href="https://www.lukassobotik.dev/project/MyFavMovies">Website</a> | <a href="https://github.com/PuckyEU/MyFavMovies/wiki">Documentation</a>
</p>

### Overview
[**MyFavMovies**](https://myfavmovies.lukassobotik.dev/) is in a streaming service like fashion, and results are **Personalized** depending on **Your Ratings** of previous movies. It contains every bit of information you would **need** or **want** to know about the movie like **Release Dates, Cast, Crew** and so on.

### How to clone this repository

#### Prerequisites
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

For more info, checkout the [Documentation](https://github.com/lukassobotik/MyFavMovies/wiki)

### License
MIT License

Copyright (c) 2023 Lukáš Sobotík

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
