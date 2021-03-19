/**
 * @classdesc IndexedDB Singleton
 * @class
 */
let IndexedDB;

(() => {
  let instance;

  /**
   * @hideconstructor
   */
  IndexedDB = function IndexedDB() {
    if (instance) {
      return instance;
    }

    instance = this;

    let db;
    let supported = true;
    let ready = false;

    const databaseName = 'timekeeper-database';
    // increase each time the model is modified
    const databaseVersions = 1;
    const databaseStoreName = 'timekeepers';

    /**
     * Check if indexedDB is supported
     * Create database
     *
     * @memberof IndexedDB
     */
    this.init = () => {
      return new Promise((resolve, reject) => {
        this.indexedDB =
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction ||
          window.webkitIDBTransaction ||
          window.msIDBTransaction || { READ_WRITE: 'readwrite' };
        this.IDBKeyRange =
          window.IDBKeyRange ||
          window.webkitIDBKeyRange ||
          window.msIDBKeyRange;

        if (!this.indexedDB) {
          supported = false;
          console.log(
            "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
          );
          return resolve();
        }
        ready = true;

        const request = this.indexedDB.open(databaseName, databaseVersions);

        request.onsuccess = (event) => {
          db = event.target.result;
          return resolve();
        };

        request.onerror = (event) => {
          return reject(new Error('Database error: ' + event.target.errorCode));
        };

        request.onupgradeneeded = (event) => {
          const store = event.target.result.createObjectStore(
            databaseStoreName,
            {
              keyPath: 'id',
            }
          );

          store.createIndex('title', 'title', { unique: false });
          store.createIndex('message', 'message', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        };
      });
    };

    this.isReady = () => supported && ready;

    /**
     *
     * @param {string} storeName
     * @param {string} mode either "readonly" or "readwrite"
     * @returns {IDBObjectStore}
     */
    const getObjectStore = (storeName, mode) => {
      const tx = db.transaction(storeName, mode);

      return tx.objectStore(storeName);
    };

    /**
     * @param {{id: string, title:string, message:string, timestamp:string}} data
     */
    this.add = async (data) => {
      const request = getObjectStore(databaseStoreName, 'readwrite').put(data);

      request.onerror = (event) => {
        console.error(
          `Database: ${event.target.errorCode} - ${event.target.error.message}`
        );
      };
    };

    /**
     * @param {{id: string, title:string, message:string, timestamp:string}[]} data
     */
    this.addAll = async (data) => {
      const objStore = getObjectStore(databaseStoreName, 'readwrite');

      data.forEach((val) => {
        const request = objStore.put(val);

        request.onerror = (event) => {
          console.error(
            `Database: ${event.target.errorCode} - ${event.target.error.message}`
          );
        };
      });
    };

    /**
     * @param {string} id timekeeper id
     */
    this.retrieve = (id) => {
      return new Promise((resolve, reject) => {
        const request = getObjectStore(databaseStoreName, 'readonly').get(id);

        request.onsuccess = (event) => {
          return resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(
            new Error(
              `Database: ${event.target.errorCode} - ${event.target.error.message}`
            )
          );
        };
      });
    };

    /**
     * @param {string} id timekeeper id
     */
    this.delete = async (id) => {
      const request = getObjectStore(databaseStoreName, 'readwrite').delete(id);

      request.onerror = (event) => {
        console.error(
          `Database: ${event.target.errorCode} - ${event.target.error.message}`
        );
      };
    };
  };
})();

export default IndexedDB;
