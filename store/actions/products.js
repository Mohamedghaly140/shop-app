import Product from '../../models/products';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        'https://shop-app-rn-4b023.firebaseio.com/products.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!!');
      }

      const resDtata = await response.json();
      const loadedProducts = [];

      for (const key in resDtata) {
        loadedProducts.push(
          new Product(
            key,
            'ui',
            resDtata[key].title,
            resDtata[key].imageUrl,
            resDtata[key].description,
            resDtata[key].price
          )
        );
      }

      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (error) {
      throw error;
    }
  };
};

export const deleteProduct = productId => {
  return async dispatch => {
    await fetch(
      `https://shop-app-rn-4b023.firebaseio.com/products/${productId}.json`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch({
      type: DELETE_PRODUCT,
      pid: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(
      'https://shop-app-rn-4b023.firebaseio.com/products.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );

    const resDtata = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resDtata.name,
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async dispatch => {
    await fetch(
      `https://shop-app-rn-4b023.firebaseio.com/products/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
