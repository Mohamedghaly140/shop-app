import React, { useState, useEffect, useCallback } from "react";
import {
	FlatList,
	Platform,
	Button,
	ActivityIndicator,
	View,
	StyleSheet,
	Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Color";

const ProductsOverviewScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const products = useSelector(state => state.products.availableProducts);
	const dispatch = useDispatch();

	const loadedProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			dispatch(productsActions.fetchProducts());
		} catch (err) {
			setError(err.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setIsRefreshing, setError]);

	useEffect(() => {
		const willFocusSub = props.navigation.addListener(
			"willFocus",
			loadedProducts
		);

		return () => {
			willFocusSub.remove();
		};
	}, [loadedProducts]);

	useEffect(() => {
		setIsLoading(true);
		loadedProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch, loadedProducts, setIsLoading]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate("ProductDetail", {
			productId: id,
			productTitle: title,
		});
	};

	if (error) {
		return (
			<View style={styles.centred}>
				<Text>An error ocurred!</Text>
				<Button
					title="try again"
					color={Colors.primary}
					onPress={loadedProducts}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centred}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<View style={styles.centred}>
				<Text>No products found. Maybe start adding some!</Text>
			</View>
		);
	}

	return (
		<FlatList
			onRefresh={loadedProducts}
			refreshing={isRefreshing}
			data={products}
			key={products.id}
			renderItem={({ item }) => (
				<ProductItem
					title={item.title}
					price={item.price}
					image={item.imageUrl}
					onSelect={() => {
						selectItemHandler(item.id, item.title);
					}}
				>
					<Button
						title="View Details"
						color={Colors.primary}
						onPress={() => {
							selectItemHandler(item.id, item.title);
						}}
					/>
					<Button
						title="Add To Cart"
						color={Colors.primary}
						onPress={() => {
							dispatch(cartActions.addToCart(item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

ProductsOverviewScreen.navigationOptions = navData => {
	return {
		headerTitle: "All Products",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Cart"
					iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
					onPress={() => {
						navData.navigation.navigate("Cart");
					}}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centred: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ProductsOverviewScreen;
