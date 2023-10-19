import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
    access_token: null,
    refresh_token: null,
    loggedIn: false
}

const persistConfig = {
    key: 'root',
    storage,
  }

export const jwtSlice = createSlice({
    name: 'jwt',
    initialState,
    reducers: {
        setAccessToken: function (state, action) {
            state.access_token = action.payload
            state.loggedIn = true
        },
        setRefreshToken: function (state, action) {
            state.refresh_token = action.payload
            state.loggedIn = true
        },

        resetTokens: () => initialState
    }
})

// Create a reducer with persisted state (state that stays whenever user exits)
const persistedjwtReducer = persistReducer(persistConfig, jwtSlice.reducer)

export const {
    setAccessToken,
    setRefreshToken,
    resetTokens
} = jwtSlice.actions

export default persistedjwtReducer