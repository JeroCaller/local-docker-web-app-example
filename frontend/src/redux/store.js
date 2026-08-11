import { configureStore } from "@reduxjs/toolkit";
import { authReducer, fileChangeReducer } from './reducer';

const store = configureStore({
	reducer: {
		authReducer: authReducer, 
		fileChangeReducer: fileChangeReducer
	}
});

export default store;
