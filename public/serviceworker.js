// serviceworker.js

const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

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

// activate the service worker (event listener)
self.addEventListener('activate', (event) => {
	// remove all previous caches and keep only the new one
	const cacheWhiteList = [];
	cacheWhiteList.push(CACHE_NAME);
	event.waitUntil(
		caches.keys().then((cacheNames) => Promise.all(
			cacheNames.map((x) => {
				if(!cacheWhiteList.includes(x)) {
					return caches.delete(x);
				}
				return caches;
			})
		))
	);
});