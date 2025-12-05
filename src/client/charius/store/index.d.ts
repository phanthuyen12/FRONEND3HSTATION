import { Store, AnyAction } from 'redux';
import { Persistor } from 'redux-persist/es/types';

export const store: Store<any, AnyAction>;
export const persistor: Persistor;

