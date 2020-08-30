export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems, totalAmount) => {
  return dispatch => {
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
          date: date.toISOString()
        }),
      }
    );

    const resDtata = await response.json();

    if (!response.ok) {
      throw new Error('Something went wrong!!');
    }

    dispatch({
      type: ADD_ORDER,
      orderData: { id:resDtata.name, items: cartItems, amount: totalAmount, date: date },
    })
  }
};
