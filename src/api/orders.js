const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-api-base-url.com/api';

export const fetchOrdersFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching orders');
  }
};

export const updateOrderStatusInAPI = async ({ orderId, itemId, status }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error updating order status');
  }
};