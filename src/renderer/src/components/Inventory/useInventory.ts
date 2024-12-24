import { useState, useEffect } from 'react';
import { Producto } from '../../interfaces';

export const useInventory = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-productos');
      setProductos(result);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const addProducto = async (producto: Producto) => {
    try {
      await window.electron.ipcRenderer.invoke('add-producto', producto);
      fetchProductos();
    } catch (error) {
      console.error('Error adding producto:', error);
    }
  };

  const updateProducto = async (producto: Producto) => {
    try {
      await window.electron.ipcRenderer.invoke('update-producto', producto);
      fetchProductos();
    } catch (error) {
      console.error('Error updating producto:', error);
    }
  };

  const disableProducto = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke('disable-producto', id);
      fetchProductos();
    } catch (error) {
      console.error('Error disabling producto:', error);
    }
  };

  return { productos, addProducto, updateProducto, disableProducto };
};

