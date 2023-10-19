import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
    id: "",
    firstname: "",
    lastname: "",
    profile_picture: ""
}

const persistConfig = {
    key: 'root',
    storage,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: function (state, action) {
            const { _id, firstname, lastname, profile_picture } = action.payload
            state.id = _id
            state.firstname = firstname
            state.lastname = lastname
            state.profile_picture = profile_picture
        },
        resetUser: () => initialState
    }
})

// Create a reducer with persisted state (state that stays whenever user exits)
const persisteduserReducer = persistReducer(persistConfig, userSlice.reducer)

export const {
    setUser,
    resetUser
} = userSlice.actions

export default persisteduserReducer