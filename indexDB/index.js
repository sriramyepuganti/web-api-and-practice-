const dbName = 'userData';
const version = 1;
const request = indexedDB.open(dbName,version);
const store = ['dropdown-1','dropdown-2']

request.onerror = () => {
    console.log(`db creation failed: ${request.error.message}`)
}

request.onsuccess = (e) => {
    console.log('db creation success');
    const { result } = request;
    
    const txn1 = result.transaction(store[0], 'readwrite');
    const collection1 = txn1.objectStore(store[0]);

    const txn2 = result.transaction(store[1], 'readwrite');
    const collection2 = txn2.objectStore(store[1]);


    // collection1.add({
    //     'action_attribute':2,
    //     id:1,
    //     name: 'dsjkdk'
    // });

    // collection2.add([1,2,4]);

    // collection3.add({
    //     keyPath: 'list',
    //     id:1
    // });

}

const getTxn = () => {
    const {result} = request;
    const txn1 = result.transaction(store[0], 'readwrite');
    const collection1 = txn1.objectStore(store[0]);

    const txn2 = result.transaction(store[1], 'readwrite');
    const collection2 = txn2.objectStore(store[1]);
    return {
        collection1,
        collection2,
    }
}

request.onupgradeneeded = () => {
    // create object store(tables)
    const { result } = request;
    const store1 = result.createObjectStore(store[0], {
        keyPath: 'action_attribute',
    });

    store1.createIndex('action_attribute','id', {
        autoIncrement: true
    });

    const store2 = result.createObjectStore(store[1], {
        autoIncrement: true,
    });
}



function addData() {
    const {collection1,collection2} = getTxn();

    collection1.add({
        action_attribute: new Date(),
        id: Math.random()
    });

    collection2.add({
        id: Math.random()
    })
}

async function readData() {
    const {collection1,collection2} = getTxn();
    let ctx = collection2.get(4);
    ctx.onsuccess = (e) => {
        console.log(ctx.result)
    }
}

function updateData() {
    const {collection1,collection2} = getTxn();
    collection2.put({id: 143},3);

}
function deleteData() {
    const {collection1,collection2} = getTxn();
    collection2.delete(3);
}