'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GasDashboard() {
  const publicClient = usePublicClient();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const balance = await publicClient.getBalance({
          address: '0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4'
        });
        const balanceInBERA = Number(balance) / 1e18;
        setBalance(balanceInBERA);
        setHistory(prev => [...prev, balanceInBERA].slice(-20));
      } catch (error) {
        console.error('Error checking balance:', error);
      }
    };

    checkBalance();
    const interval = setInterval(checkBalance, 10000);
    return () => clearInterval(interval);
  }, [publicClient]);

  const data = {
    labels: history.map((_, i) => `-${20 - i}s`),
    datasets: [
      {
        label: 'Relayer Balance (BERA)',
        data: history,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gas Usage Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gas Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
        <p className="text-3xl font-bold">{balance.toFixed(4)} BERA</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
} 