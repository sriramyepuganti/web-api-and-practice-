/**
 * service worker = sw
 * first time load: install, activate will be called, fetch will not be triggered even though you make a api call
 * second refresh: only fetch will be called
 * if there is bit change in sw file, browser treated it as new service worker 
 * refresh the page. install will be called
 * go to application -> service workers will see old sw running and new one in waiting state.
 * new refresh will not make it to activate state. either hardreload or close and open tab will make it activate
 * use skip waiting keyword to activate new sw. witout hardreload or close and open the page but still controll in old sw 
 * clients.claim is give controll to new sw
 */

/**
 * sw dev tools
 * offline option - network will be offline and we can check the flow working
 * update on reload option- will install, activate,fetch 
 * source: display sw file
 * status: display running status
 * skip waiting option: to skip waiting period for new sw file
 * clients: display how many tabs using this service workers 
 */

/**
 * cache.add or addAll => fetch + put
 */

/**
 *** cache only
 * Assets that will never change once it is cached the first time.
 * const preCache = ['main.js'];
 * event.waitUntil(caches.open(cacheName).then((cache) => {
 *  return cache.addAll(precachedAssets);
 * }))
 * const isPrecachedRequest = preCache.includes(url.pathname);
 *
 * if (isPrecachedRequest) {
 * event.respondWith(caches.open(cacheName).then((cache) => {
 *   return cache.match(event.request.url);
 *  }));
 * }
 *** Network Only 
 * strategy is used on assets and files that constantly change. no interaction with cache
 * event.respondWith(fetch(e.request.url))
 *** cache first
 * Assets like images, videos, CSS, etc, files that are non-critical to the web app.
 * event.respondWith(caches.open(cacheName).then((cache) => {
 *    return cache.match(event.request.url).then((cachedResponse) => {
 *     if (cachedResponse) {
 *     return cachedResponse;
 *     }
 *     return fetch(event.request).then((fetchedResponse) => {
 *                    cache.put(event.request, fetchedResponse.clone());
 *                    return fetchedResponse;
 *            });
 *         });
 *    }));
 *** Network First
 * Requests that are updating frequently, especially POST requests.
 * event.respondWith(caches.open(cacheName).then((cache) => {
 *    return fetch(event.request.url).then((fetchedResponse) => {
 *      cache.put(event.request, fetchedResponse.clone());
 *      return fetchedResponse;
 *     }).catch(() => {
 *      return cache.match(event.request.url);
 *     });
 *  }));
 * 
 * 
 *** Stale-While-Revalidate 
 * high-priority, high-critical files. Also, non-GET requests like POST requests.
 *    event.respondWith(caches.open(cacheName).then((cache) => {
 *          return cache.match(event.request).then((cachedResponse) => {
 *              const fetchedResponse = fetch(event.request).then((networkResponse) => {
 *                  cache.put(event.request, networkResponse.clone());
 *                  return networkResponse;
 *              });
 *              return cachedResponse || fetchedResponse;
 *          });
 *     }));
 */


 const cacheName = 'v5';
 const preCacheFiles = [
     'index.html',
     'index.css',
     'index.js',
 ];
 
 const apiList = [
     'https://jsonplaceholder.typicode.com/posts',
     'https://jsonplaceholder.typicode.com/comments',
     'https://jsonplaceholder.typicode.com/photos',
     'https://jsonplaceholder.typicode.com/todos',
     'https://jsonplaceholder.typicode.com/users'];
 
 // service worker is installed
 addEventListener('install', (e) => {
     console.log('installed');
     e.waitUntil((async () => {
         const cache = await caches.open(cacheName);
         const resp = await cache.addAll(preCacheFiles);
         // Programmatically call browser skipWaiting option to update service worker changes to activate.
         await self.skipWaiting();
     })());
 });
 
 // service worker is activated
 addEventListener('activate', (e) => {
     console.log('activated');
     e.waitUntil((async () => {
         //  give control to new service worker changes
         const keyList = await caches.keys();
         await Promise.all(keyList.filter(key => (key !== cacheName)).map(keys => caches.delete(keys)));
         await clients.claim();
     })()
     )
 });
 
 // service worker intercepted fetch call
 addEventListener("fetch", e => {
     console.log('fetch')
     if (apiList.includes(e.request.url) || e.request.destination === "document") {
 
         e.respondWith((async () => {
             const cache = await caches.open(cacheName);
             const resp = await cache.match(e.request);
             if (resp) {
                 return resp;
             } else {
                 const data = await fetch(e.request);
                 await cache.put(e.request, data.clone());
                 return data;
 
             }
         })());
     }
 })
 