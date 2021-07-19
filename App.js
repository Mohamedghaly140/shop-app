import React, { useState } from "react";
import { StatusBar, Platform } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import ShopNavigator from "./navigation/ShopNavigator";
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";

const rootReducer = combineReducers({
	products: productsReducer,
	cart: cartReducer,
	orders: ordersReducer,
	auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
	return Font.loadAsync({
		"open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
		"open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
	});
};

export default function App() {
	const [loadedFonts, setLoadedFonts] = useState(false);

	if (!loadedFonts) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => setLoadedFonts(true)}
				onError={console.warn}
			/>
		);
	}

	return (
		<Provider store={store}>
			<StatusBar
				barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
			/>
			<ShopNavigator />
		</Provider>
	);
}
