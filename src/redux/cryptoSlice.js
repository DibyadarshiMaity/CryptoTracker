import { createSlice } from '@reduxjs/toolkit';
import cryptoData from './cryptoData';

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    coins: cryptoData,
  },
  reducers: {
    simulatePriceChange: (state) => {
      state.coins = state.coins.map((coin) => {
        const randomChange = (Math.random() - 0.5) * 2; // random between -1% to +1%
        const newPrice = coin.current_price * (1 + randomChange / 100);
        return {
          ...coin,
          current_price: parseFloat(newPrice.toFixed(2)),
          price_change_percentage_1h_in_currency: parseFloat(randomChange.toFixed(2)),
        };
      });
    },
  },
});

export const { simulatePriceChange } = cryptoSlice.actions;
export default cryptoSlice.reducer;
