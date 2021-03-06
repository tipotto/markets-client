import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import history from '../history';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const storeCreator = () => {
  const sagaMiddleware = createSagaMiddleware();
  const reduxDevTools = composeWithDevTools();

  // 永続化の設定
  const persistConfig = {
    key: 'root', // Storageに保存されるキー名を指定する
    storage, // 保存先としてlocalStorageがここで設定される
    // whitelist: ["todos"],
    // blacklist: ['visibilityFilter']
  };

  // 永続化設定されたReducerとして定義
  const persistedReducer = persistReducer(persistConfig, rootReducer(history));

  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(sagaMiddleware, routerMiddleware(history)),
      reduxDevTools,
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default storeCreator;
