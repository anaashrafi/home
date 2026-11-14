// Firebase is only used for the footer visitor counter, so it is loaded lazily
// (separate chunk, after the page is idle) instead of in the main bundle.

const firebaseConfig = {
  apiKey: "AIzaSyDbKe1DCXrbKrVkLzpWQlWl1S3S1uDgmHA",
  authDomain: "anurag-portfolio-9a906.firebaseapp.com",
  databaseURL: "https://anurag-portfolio-9a906-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anurag-portfolio-9a906",
  storageBucket: "anurag-portfolio-9a906.firebasestorage.app",
  messagingSenderId: "49636189586",
  appId: "1:49636189586:web:3426281709535c81e58d4b",
  measurementId: "G-KZ467MRSBG"
};

let dbPromise = null;

/** Resolves to { database, ref, onValue, runTransaction }; loads the SDK on first call. */
export const loadDatabase = () => {
  if (!dbPromise) {
    dbPromise = Promise.all([
      import('@firebase/app'),
      import('@firebase/database'),
    ]).then(([{ initializeApp }, db]) => {
      const app = initializeApp(firebaseConfig);
      return {
        database: db.getDatabase(app),
        ref: db.ref,
        onValue: db.onValue,
        runTransaction: db.runTransaction,
      };
    });
  }
  return dbPromise;
};
