import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        'https://shop-app-rn-4b023.firebaseio.com/orders/u1.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!!');
      }

      const resDtata = await response.json();
      const loadedOrders = [];

      for (const key in resDtata) {
        loadedOrders.push(
          new Order(
            key,
            resDtata[key].cartItems,
            resDtata[key].totalAmount,
            new Date(resDtata[key].date)
          )
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (error) {
      throw error;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch(
      'https://shop-app-rn-4b023.firebaseio.com/orders/u1.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    const resDtata = await response.json();

    if (!response.ok) {
      throw new Error('Something went wrong!!');
    }

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resDtata.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
