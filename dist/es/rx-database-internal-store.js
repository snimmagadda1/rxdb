import { getComposedPrimaryKeyOfDocumentData } from './rx-schema-helper';
import { getSingleDocument, writeSingle } from './rx-storage-helper';
import { createRevision, getDefaultRevision, getDefaultRxDocumentMeta, randomCouchString } from './util';

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

export var ensureStorageTokenExists = function ensureStorageTokenExists(rxDatabase) {
  try {
    var storageTokenDocumentId = getPrimaryKeyOfInternalDocument(STORAGE_TOKEN_DOCUMENT_KEY, INTERNAL_CONTEXT_STORAGE_TOKEN);
    /**
     * To have less read-write cycles,
     * we just try to insert a new document
     * and only fetch the existing one if a conflict happened.
     */

    var storageToken = randomCouchString(10);
    return Promise.resolve(_catch(function () {
      var docData = {
        id: storageTokenDocumentId,
        context: INTERNAL_CONTEXT_STORAGE_TOKEN,
        key: STORAGE_TOKEN_DOCUMENT_KEY,
        data: {
          token: storageToken
        },
        _deleted: false,
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision(),
        _attachments: {}
      };
      docData._rev = createRevision(docData);
      return Promise.resolve(writeSingle(rxDatabase.internalStore, {
        document: docData
      })).then(function () {
        return storageToken;
      });
    }, function (err) {
      var _exit = false;

      function _temp2(_result) {
        if (_exit) return _result;
        throw err;
      }

      var _temp = function () {
        if (err.isError && err.status === 409) {
          return Promise.resolve(getSingleDocument(rxDatabase.internalStore, storageTokenDocumentId)).then(function (useStorageTokenDoc) {
            if (useStorageTokenDoc) {
              var _useStorageTokenDoc$d2 = useStorageTokenDoc.data.token;
              _exit = true;
              return _useStorageTokenDoc$d2;
            }
          });
        }
      }();

      /**
       * If we get a 409 error,
       * it means another instance already inserted the storage token.
       * So we get that token from the database and return that one.
       */
      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * Returns all internal documents
 * with context 'collection'
 */
export var getAllCollectionDocuments = function getAllCollectionDocuments(storageInstance, storage) {
  try {
    var getAllQueryPrepared = storage.statics.prepareQuery(storageInstance.schema, {
      selector: {
        context: INTERNAL_CONTEXT_COLLECTION
      },
      sort: [{
        id: 'asc'
      }]
    });
    return Promise.resolve(storageInstance.query(getAllQueryPrepared)).then(function (queryResult) {
      var allDocs = queryResult.documents;
      return allDocs;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * to not confuse multiInstance-messages with other databases that have the same
 * name and adapter, but do not share state with this one (for example in-memory-instances),
 * we set a storage-token and use it in the broadcast-channel
 */

export var INTERNAL_CONTEXT_COLLECTION = 'collection';
export var INTERNAL_CONTEXT_STORAGE_TOKEN = 'storage-token';
export var INTERNAL_CONTEXT_ENCRYPTION = 'plugin-encryption';
export var INTERNAL_CONTEXT_REPLICATION_PRIMITIVES = 'plugin-replication-primitives';
export var INTERNAL_STORE_SCHEMA = {
  version: 0,
  primaryKey: {
    key: 'id',
    fields: ['context', 'key'],
    separator: '|'
  },
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    key: {
      type: 'string'
    },
    context: {
      type: 'string',
      "enum": [INTERNAL_CONTEXT_COLLECTION, INTERNAL_CONTEXT_STORAGE_TOKEN, INTERNAL_CONTEXT_ENCRYPTION, INTERNAL_CONTEXT_REPLICATION_PRIMITIVES, 'OTHER']
    },
    data: {
      type: 'object',
      additionalProperties: true
    }
  },
  indexes: [],
  required: ['key', 'context', 'data'],
  additionalProperties: false
};
export function getPrimaryKeyOfInternalDocument(key, context) {
  return getComposedPrimaryKeyOfDocumentData(INTERNAL_STORE_SCHEMA, {
    key: key,
    context: context
  });
}
export var STORAGE_TOKEN_DOCUMENT_KEY = 'storageToken';
//# sourceMappingURL=rx-database-internal-store.js.map