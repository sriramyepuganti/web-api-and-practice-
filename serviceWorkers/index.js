
//  check browser support for service worker and register service worker
async function start() {
    try {
        if ("serviceWorker" in navigator) {
            const resp = await navigator.serviceWorker.register("sw.js");
            console.log("service worker registered");
        } else {
            console.log("browser not support service workers");
        }
    } catch (err) {
        console.log("service workerer not regisetred")
    }

}

//  check if service worker already installed
// if (navigator?.serviceWorker?.controller) {
//     console.log('servicer worker is already registered');
// }

//  on servicer worker version change
// navigator.serviceWorker.oncontrollerchange = () => {
//     console.log('service worker version changed');
// }

// unregister service worker
// navigator.serviceWorker.getRegistrations().then((regs) => {
//     console.log(regs)
//     for (const reg of regs) {
//         reg.unregister().then(unreg => console.log(unreg))
//     }
// });


const fetchDataWithCatch = async () => {
    const apiList = [
        'https://jsonplaceholder.typicode.com/posts',
        'https://jsonplaceholder.typicode.com/comments',
        'https://jsonplaceholder.typicode.com/photos',
        'https://jsonplaceholder.typicode.com/todos',
        'https://jsonplaceholder.typicode.com/users'];
    const responses = await Promise.all(apiList.map(url => fetch(url).then(res => res.json())));
}


const fetchDataWithOutCatch = () => {
    fetch('https://jsonplaceholder.typicode.com/albums')
        .then(res => res.json())
        .then(data => console.log({
            withCatch: data
        }));
}


start();