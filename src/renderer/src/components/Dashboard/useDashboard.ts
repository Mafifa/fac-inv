import { useState, useEffect } from 'react';

export const useDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState<Array<{id: number, name: string, sales: number}>>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('get-dashboard-data');
        setTotalSales(result.totalSales);
        setTotalProducts(result.totalProducts);
        setLowStockProducts(result.lowStockProducts);
        setTopSellingProducts(result.topSellingProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return { totalSales, totalProducts, lowStockProducts, topSellingProducts };
};

