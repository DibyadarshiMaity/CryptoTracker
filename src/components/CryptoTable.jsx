import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { simulatePriceChange } from '../redux/cryptoSlice';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoTable = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.crypto.coins);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(simulatePriceChange());
    }, 1500);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="table-container">
      {/* Search bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by Name or Symbol"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
      </div>

      {/* Crypto Table */}
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>24h Volume</th>
            <th>Circulating Supply</th>
            <th>Max Supply</th>
            <th>7D Chart</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr key={coin.id}>
              <td>
              <img src={`/assets/${coin.image}`} alt={coin.name} width="30" height="30" />
              </td>

              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.current_price.toLocaleString()}</td>

              <td className={coin.price_change_percentage_1h_in_currency >= 0 ? 'positive' : 'negative'}>
                {coin.price_change_percentage_1h_in_currency}%
              </td>

              <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                {coin.price_change_percentage_24h}%
              </td>

              <td className={coin.price_change_percentage_7d_in_currency >= 0 ? 'positive' : 'negative'}>
                {coin.price_change_percentage_7d_in_currency}%
              </td>

              <td>${coin.market_cap.toLocaleString()}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>{coin.circulating_supply.toLocaleString()}</td>
              <td>{coin.max_supply ? coin.max_supply.toLocaleString() : '-'}</td>

              <td style={{ width: "120px", height: "60px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateFakeChartData(coin.current_price)}>
                    <XAxis dataKey="day" tick={{ fontSize: 8 }} stroke="#ccc" />
                    <YAxis tick={{ fontSize: 8 }} width={30} stroke="#ccc" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const generateFakeChartData = (currentPrice) => {
    const data = [];
    let price = currentPrice;
    for (let i = 6; i >= 0; i--) {
      const randomPercent = (Math.random() - 0.5) * 0.02; 
      price = price / (1 + randomPercent); 
      data.unshift({
        day: `Day ${7 - i}`,
        price: parseFloat(price.toFixed(2))
      });
    }
    data[6] = {
      day: "Day 7",
      price: parseFloat(currentPrice.toFixed(2))
    };
  
    return data;
  };
  

export default CryptoTable;
