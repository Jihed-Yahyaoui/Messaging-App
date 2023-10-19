import { configureStore } from '@reduxjs/toolkit'
import jwtReducer from './slices/jwtSlice'
import userReducer from './slices/userSlice'
import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: {
    jwt: jwtReducer,
    user: userReducer
  },
  middleware: [thunk], // To deal with non-serializable persist action values
})

export const persistor = persistStore(store)