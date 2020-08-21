# Progressive Web Apps

[Build and Deploy a React PWA - Why Progressive Web Apps are the Future of the Web](https://youtu.be/IaJqMcOMuDM)

| Web Apps                                                     | Native Apps                                                  | PWAs                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Work on a range of different devices and operating systems.  | Rich and Reliable. Work offline.                             | All browsers, devices, OS's. Can work offline.               |
| Web applications can reach anyone, anywhere, on any device with a single codebase. | Ever-present; visible on home screens, docks, and task-bars. | Can be installed to home screen & have access to mobile features. |

## Goal: Make a simple weather app

- "Google Lighthouse Progressive Web App Checklist":
  - [ ] Link to checklist & audit: https://developers.google.com/web/tools/lighthouse/#devtools
  - [ ] Link to PWA store: https://progressiveapp.store/home

### Video Timestamps

Key:

- A-Z:  The 26 steps of this app setup
- T1, T2... : The TEST steps
- L1, L2... : The LIGTHOUSE AUDIT steps
- N1, N2... : The NETLIFY hosting steps
- P1, P2... : The PUBLISH to PWA store steps

4:03 Start of coding session
4:17 Open terminal
4:23 [A](#) Run the command **`npx create-react-app ./`** to create new create-react-app project in current directory
4:44 [B](#) [C](#) Speaker **deletes `src/` folder** & **creates a new `src/` folder** as their own preference
5:03 [D](#) Speaker creates inside of new `src/` folder a **new file: `index.js`**
5:15 [E](#) Speaker adds to `index.js` the following imports: **`import React from 'react'; import ReactDOM from 'react-dom';`** and the following line of code `ReactDOM.render(<App />, document.getElementById('root'));`
5:41 [F](#) Speaker "specifies app" by **adding this line to `index.js`: `import App from './App';`** which will be a functional component
6:00 [G](#) Speaker **creates `App.js`** inside of `src/`
6:30 Speaker notes that the `index.html` file can be tidied up, by removing comments and making some tags into "single liners".

> Note: We will be using the `index.html` file inside of `public/` somewhat often for this tutorial.

6:40 Speaker explains connection between the `<div id="root"></div>` in `index.html` and the call to root in `index.js` (topic: ReactJS fundamentals)
7:00 [H](#) Speaker moves to `App.js` to start **creating their app component**:

```javascript
// src/App.js
import React from 'react';
const App = () => {
    return (<h1>App</h1>);
}
export default App;
```

7:32 [T1](#) Speaker demonstrates that they can run the app as-is right now using `npm start` in the terminal
7:50 [I](#) Speaker **installs Axios** into the project via the terminal: **`npm install --save axios`** Axios will be used to make the `GET` request to the weather API

- Bonus steps needed for 2020/07/21 :
  - Run `npm audit fix` to resolve security vulnerabilities
  - Follow instructions here to resolve security vulnerabilities with `yargs-parser`: https://github.com/facebook/create-react-app/issues/9033

8:00 [J](#) Speaker **creates folder** inside of `src/` **called `api/`** and a **file called `fetchWeather.js`** inside of `api/`

- ```javascript
  // fetchWeather.js
  // source: https://gist.github.com/adrianhajdin/fd4a0db480ee827f11756bdae0597f0d
  
  import axios from 'axios';
  const URL = 'https://api.openweathermap.org/data/2.5/weather';
  const API_KEY = 'f33a484cf794d08d0148764789aaba32';
  // function that will fetch the weather data
  // query == name of the city we want to get weather data on
  export const fetchWeather = async ( query ) => {
      /* To specify parameters of get request, we pass a 
      * specific object as the 2nd parameter. This specific object
      * contains the city query, the unit of measurement, and the
      * API key. */
      // "destructure" the data from the response (the return of axios.get() call)
      const { data }  = await axios.get(URL, {
          params: {
              q: query,
              units: 'metric',
              APPID: API_KEY
          }
      });
      return data;
  };
  ```

- 10:30 [K](#) Speaker modifies `App.js` so it looks like this:

  ```javascript
  // src/App.js
  
  import React, { useState } from 'react'; // we will use the useState hook
  import {fetchWeather} from './api/fetchWeather';
  import './App.css';
  
  const App = () => {
      // destructure query search term and setQuery setter method for state field
      const [query, setQuery] = useState(''); // query state field
      
      // fetch data after collecting user input
      const search = async (e) => { // takes in an event
          if(e.key === 'Enter') { // if pressed key is enter, we search
              const data = await fetchWeather(query);
              
              console.log(data);
          }
      }
      
      // input value and onChange handler need to come from the state
      return(<div className="main-container">
             	<input type="text" className="search"
             		placeholder="Search ... " value={query}
  				onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={search}
             	/>
             </div>);
  };
  
  export default App;
  ```

- 11:00 [L](#) Speaker imports CSS styling into a new file `App.css` inside of `src/` (see CSS styling link as you desire)

- 11:40 - 14:45 (summary point) Speaker sets up `App.js` with `<input />` form and `search()` functionality.

- 14:45 [T2](#) Speaker re-runs app w/ `npm start` to confirm that upon typing into the text input, various weather data is logged to the developer console

  - Bonus step: Upon running app, the Dev Tools Console tab gives the following warning & error:

    ```markdown
    A cookie associated with a cross-site resource at http://hdwallpaper20.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.
    
    wallpaper-wp4001752.jpg:1 Failed to load resource: the server responded with a status of 522 ()
    ```

  - Resolution step: Deleting the cookie within the Dev Tools at Application > Storage > Cookies resolves the issue of the non-loading background image (2020/07/21)

- 15:17 - 16:25 [M](#) Speaker modifies `App.js` so that it looks like:

  ```javascript
  // src/App.js
  import React, { useState } from 'react';
  import {fetchWeather} from './api/fetchWeather';
  import './App.css';
  
  const App = () => {
      const [query, setQuery] = useState('');
      const [weather, setWeather] = useState({}); // NEW
      
      const search = async (e) => {
          if(e.key === 'Enter') {
              const data = await fetchWeather(query);
              setWeather(data); // NEW
              setQuery(''); // NEW - reset the input field
          }
      }
      
      // input value and onChange handler need to come from the state
      return(<div className="main-container">
             	<input type="text" className="search" placeholder="Search ... " value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search} />
             </div>);
  }
  ```

- 16:25 - 21:05 [N](#) Speaker adds conditionally rendering element (city, country, temp, and weather icon image) to App component (in `App.js`):

  ```javascript
  <div className="main-container">
  	<input ... />
  	{weather.main && (
  		<div className="city">
       		<h2 className="city-name">
       			<span>{weather.name}</span>
  				<sup>{weather.sys.country}</sup>
       		</h2>
  			<div className="city-temp">
                  {Math.round(weather.main.temp)}
                  <sup>&deg;C</sup>
  			</div>
  			<div className="info">
                  <img className="city-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
  				<p>{weather.weather[0].description}</p>
              </div>
       	</div>
  	)}
  </div>
  ```

  

8:15 - 21:00 = [12 min 45 sec](#) Speaker builds full React app 

21:00 - 44:00  = [23 min](#) Speaker adds service worker, upgrades PWA to pass most of Lighthouse report checklist by adding offline functionality, ability to install

- Note: Speaker mentions that for this second of the tutorial, we will be using primarily (only?) the `public/` folder

- 21:45 [O](#) Firsly, speaker deletes all files inside of `public/` ***except*** for `index.html`

- 22:05 In the next section, the speaker says we will add the service worker

  > Note: Service worker are JS files that run all the time, even after a page is closed. Service workers are useful for sending push notifications from a mobile phone to the user, and can even do things when the user is offline.

- 22:30 - 24:40 [P](#) Speaker **registers a service worker** by adding the following script element to `index.html` just below the root `<div>`:

  ```html
  <script>
      // check whether service worker is supported by our current browser
      if('serviceWorker' in navigator) {
      	window.addEventListener('load', () => {
              // enables us to create our own service worker
              // Note: You can confirm catch works by removing '.js' on the next line 
              navigator.serviceWorker.register('./serviceworker.js') // returns a promise
              	.then((registration) =>
                        // let's log the URL on which the service worker was installed
                        console.log('Success: ', registration.scope))
              	// just in case something goes wrong...
              	.catch((err) => console.log('Failure: ', err));
          })
      }
  </script>
  ```

- 23:40 [Q](#) Continuing on the process of making our first service worker, the speaker makes a file called `serviceworker.js` inside of `public/` (note the lower case spelling):

  ```javascript
  // serviceworker.js
  // this can stay empty for now...
  ```

- 24:40 [T3](#) Speaker goes back to the web browser to test their application, using the Applicaton tab inside of the Developer Tools to inspect the Manifest, Service Workers, and Clear storage `(TODO: rewatch tutorial video for useful actionables)`

  > Note: There should be one error: `Manifest: Line: 1, column: 1, Syntax error.`

- 24:55 [T4](#) Speaker confirms that, in <kbd>Application Tab</kbd> > <kbd>Application</kbd> > <kbd>Service Workers</kbd>, "Update on reload" is checked (this is needed for testing purposes as we will update our service worker a bunch of times) (Note: Upon first trial run of this, it was unchecked by default)

- 25:15 [T5](#) Speaker clicks on <kbd>Clear site data</kbd> button in <kbd>Application Tab</kbd> > <kbd>Application</kbd> > <kbd>Clear storage</kbd>

- 25:40 [R](#) Speaker temporarily comments out manifest link inside of `index.html` (it looks like this: `<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />`)

- [T6](#) Running the app from the browser should now result in a successful run with no errors. (2020/07/22 update: Still getting the CORS cross-site resource set w/o `SameSite` attribute warning & GET wallpaper error code 522, moving on for now... Attempt 2 update: Deleting only the 522 cookie corrects the issue again...)

- 25:53 - 29:40 [S](#) Speaker starts working on service worker in `serviceworker.js`:

  ```javascript
  // serviceworker.js
  // cache means "storage of the browser"
  // The cache enables us to not have to reload assets (such as images) each time
  const CACHE_NAME = "version-1";
  const urlsToCache = ['index.html', 'offline.html'];
  
  const self = this; // boilerplate for service worker
  
  // service worker installation event
  self.addEventListener('install', (event) => {
      event.waitUntil(
          caches.open(CACHE_NAME)
          	.then((cache) => {
                  console.log('Opened cache');
                  return cache.addAll(urlsToCache);
              })
      );
  });
  ```

- 29:45 Speaker demonstrates that the cache open (upon the firing of the installation event) is logged when the cache data is cleared ( <kbd>Application Tab</kbd> > <kbd>Application</kbd> > <kbd>Clear storage</kbd> > <kbd>Clear site data</kbd> button) `(TODO: give more specific step by step, assess utility/value)`

- 30:10 Speaker demonstrates that the cache can be inspected by going to  <kbd>Application Tab</kbd> > <kbd>Cache</kbd> > <kbd>Cache storage</kbd> > <kbd>version-1 - http://localhost:3000...</kbd> where you should be able to see both the `index.html` and `offline.html` files

- 30:30 - 33:15 [T](#) Speaker continues working on `serviceworker.js` (note: this is very heavily nested code...)

  ```javascript
  // serviceworker.js
  //...
  
  // listen for requests (to do something with requests once they are heard)
  self.addEventListener('fetch', (event) => {
      event.respondWith(
      	caches.match(event.request) // ie. requests for pages, images, etc.
          	.then(() => {
                  return fetch(event.request)
                  	// if fetch fails, we are offline
                  	.catch(() => caches.match('offline.html'))
              })
      );
  });
  ```

- 33:15 - 36:15 [U](#) Speaker continues to work on `serviceworker.js`...

  ```javascript
  // serviceworker.js
  // ...
  
  // activate the service worker (event listener)
  self.addEventListener('activate', (event) => {
     // remove all previous caches and keep only the new one
      const cacheWhiteList = [];
      cacheWhiteList.push(CACHE_NAME);
      event.waitUntil(
      	caches.keys().then((cacheNames) => Promise.all(
          	cacheNames.map((cacheName) => {
                  if(!cacheWhiteList.includes(cacheName)) {
                      return caches.delete(cacheName);
                  }
              })
          ))
      );
  });
  ```

- 36:15 [V](#) Speaker **creates `offline.html`** inside of `public/` and pastes in simple HMTL document markup

- 36:40 Speaker goes through the full demo to show:

  - [L1](#) Open the web browser at localhost:3000

    ```markdown
    Service Worker was updated because "Update on reload" was checked in the DevTools Application panel.
    serviceworker.js:13 Opened cache
    serviceworker.js:13 Opened cache
    log.js:24 [HMR] Waiting for update signal from WDS...
    (index):37 Success:  http://localhost:3000/
    ```

    

  - [L2](#) Reload the app (refresh the page)

    ```markdown
    [HMR] Waiting for update signal from WDS...
    (index):37 Success:  http://localhost:3000/
    ```

    

  - [L3](#) Open the developer tools to  the Application tab

  - [L4](#) Clear storage under Application > Application > Clear Storage > <kbd>Clear site data</kbd>

  - [L5](#) Go back to Dev Tools Console tab & refresh to see "Opened cache" and "Success", as well as back in Application Tab > Cache > Cache Storage > Version-1... to see both `index.html` and `offline.html` have HTML markup data loaded inside. Note: First refresh was not successful, but 2nd refresh was (2020/07/22), also note that, upon hitting the refresh button, "opened cache" appears briefly in the console and then disappears

    ```markdown
    [HMR] Waiting for update signal from WDS...
    (index):37 Success:  http://localhost:3000/
    ```

    

  - 37:25 [L6](#) Go to Network tab, click on "Online" option to change status to "Offline", and then refresh the page to see the Offline mode version of the web app display

  - 37:45 [L7](#) Change status back to "Online", refresh page, and change Dev Tools tab to the Lighthouse tab, then click on <kbd>Generate report</kbd> (note: we are still missing the manifest, so it won't be 100% yet). Note 1: Before running the Lighthouse Audit, note that only the PWA audit is to be run, and the speaker does their audit for mobile devices only, while they are on a PC device. Your results may vary... Note 2: There will be many red error messages, and as of 2020/07/22, running this as is returns 2/3, 1/3, 4/7 on the three checklist sections. This is in alignment with the results of the video tutorial.

- 38:25 - 41:00 [W](#) Speaker **creates `manifest.json`** inside of `public/`:

  ```json
  {
      "short_name": "Weather App",
      "name": "Weather App PWA",
      "icons": [
          {
              "src": "/images/logo.png",
              "type": "image/png",
              "sizes": "1024x1024"
          }
      ],
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff"
  }
  ```

- 41:10 - 41:25 [X](#) Speaker **adds `images/` folder** inside `public/` folder, puts `bg.img` and `logo.png` files inside new `images/` folder

- 41:25 - 42:50 [Y](#) Speaker modifies `index.html`:

  - Speaker **uncomments the manifest `<link>` inside of `index.html` **and **modifies it** to look like this: **`<link rel="manifest" href="./manifest.json" />`**
  - modifies the `"apple-touch-icon"` link element as well to have the correct file path: **`<link rel="apple-touch-icon" href="./images/logo.png" />`**
  - modifies `<meta>`  element description content to be `"Modern PWA Weather React Application"`
  - modifies `<title>` element text content to be `"Weather App"`
  - replaces favicon `<link>` href attribute path with `"./images/logo.png"` and add `type="image/png"` to it (because favicons are usually `.ico` file extension) so it will look like this: `<link rel="icon" type="image/png" href="./images/logo.png" />`

- 42:50 Speaker demonstrates again, going back to the app inside of the web browser:

  - [L8](#) Refreshing the page, notice that the icon and page title have changed

  - [L9](#) Going back to the Dev Tools and the Lighthouse tab within, and clicking the gray circle with line through it "Clear all" button to clear the audit data, again click the <kbd>Generate report</kbd> button. Everything should pass except for one item "Does not redirect HTTP traffic to HTTPS"

    Issue on 2020/08/20: Wallpaper fails to load upon initial app run, though this is resolved upon running the Lighthouse report... Hopefully, this issue will not affect the PWA publishing efforts. Moving on for now as-is.

    Issue on 2020/08/20: Under Lighthouse report "PWA Optimized", we get a gray indicator (instead of green) for "Content is sized correctly for the viewport" indicating that this content has not been made responsive for various viewport sizes.

- 43:50 Speaker states that we will now host our app on Netlify

44:00 Speaker notes that Netlify can be used to deploy app, deploys app, and passes final Lighthouse report checklist item

- [N1](#) Log into Netlify site w/ free account
- Once logged in, look at the bottom of the page for something that says "Want to deploy a new site... ?" for a drag and drop app deployment
- [Z](#) Speaker runs command `npm run build` to create a production ready version of the app. This will create a `build/` folder for you in the root of your project
- [N2](#) Speaker then drags and drops the `build/` folder into the drag and drop box on Netlify to quick deploy their app
- Using the link that Netlify provides once you have deployed your app, you can try out your deployed app
- 45:30 Using the Netlify deployed app in the browser, go to the Network tab of the Developer Tools and confirm that offline mode works... except, this time, you will have to actually turn off your WiFi to confirm, since the browser can tell it is still connected to the Internet
- [L10](#) 46:20 Speaker runs Lighthouse audit after turning the Internet connection and "Online" mode back on
  - Please note that the Lighthouse audit checklist should return 100% green (all checks pass) and that an icon showing a circle with a plus sign inside should appear in the browser address entry bar (on the right side)

46:37 Speaker notes that once a PWA passes all Lighthouse audits, it can be installed onto devices (desktop computers? mobile phones?) via Chrome
47:35 Speaker explains how to publish deployed PWA to an app store

- 48:03 Speaker starts the demo of how to publish a deployed PWA to an app store
  1. [P1](#) Log into app store
  2. [P2](#) Go to profile
  3. [P3](#) Click on plus icon
  4. [P4](#) Enter info on your app (Name, Tags, Icon, Link to hosted app, Description, Category, Screenshots)
     - [P5](#) Speaker takes screenshots of their app to display here
  5. [P6](#) Run Lighthouse PWA audit
  6. [P7](#) Submit after passing audit
  7. [P8](#) Wait until publishing is approved

