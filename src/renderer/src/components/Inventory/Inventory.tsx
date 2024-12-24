import React, { useState } from 'react';
import { useInventory } from './useInventory';
import { Producto } from '../../interfaces';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Inventory: React.FC = () => {
  const { productos, addProducto, updateProducto, disableProducto } = useInventory();
  const [newProducto, setNewProducto] = useState<Partial<Producto>>({});
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const handleAddProducto = () => {
    if (newProducto.nombre && newProducto.precio_base && newProducto.stock) {
      addProducto(newProducto as Producto);
      setNewProducto({});
      toast.success('Producto agregado exitosamente');
    } else {
      toast.error('Por favor, complete todos los campos');
    }
  };

  const handleUpdateProducto = () => {
    if (editingProducto) {
      updateProducto(editingProducto);
      setEditingProducto(null);
      toast.success('Producto actualizado exitosamente');
    }
  };

  const handleDisableProducto = (id: number) => {
    disableProducto(id);
    toast.info('Producto deshabilitado');
  };

  return (
    <div className="inventory">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Inventory</h1>
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Add New Product</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newProducto.nombre || ''}
            onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio Base"
            value={newProducto.precio_base || ''}
            onChange={(e) => setNewProducto({ ...newProducto, precio_base: Number(e.target.value) })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProducto.stock || ''}
            onChange={(e) => setNewProducto({ ...newProducto, stock: Number(e.target.value) })}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddProducto}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            <Plus className="h-5 w-5 inline-block mr-2" />
            Add Product
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.id_producto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingProducto?.id_producto === producto.id_producto ? (
                    <input
                      type="text"
                      value={editingProducto.nombre}
                      onChange={(e) => setEditingProducto({ ...editingProducto, nombre: e.target.value })}
                      className="p-1 border rounded"
                    />
                  ) : (
                    producto.nombre
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingProducto?.id_producto === producto.id_producto ? (
                    <input
                      type="number"
                      value={editingProducto.precio_base}
                      onChange={(e) => setEditingProducto({ ...editingProducto, precio_base: Number(e.target.value) })}
                      className="p-1 border rounded"
                    />
                  ) : (
                    producto.precio_base
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingProducto?.id_producto === producto.id_producto ? (
                    <input
                      type="number"
                      value={editingProducto.stock}
                      onChange={(e) => setEditingProducto({ ...editingProducto, stock: Number(e.target.value) })}
                      className="p-1 border rounded"
                    />
                  ) : (
                    producto.stock
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingProducto?.id_producto === producto.id_producto ? (
                    <button
                      onClick={handleUpdateProducto}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingProducto(producto)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDisableProducto(producto.id_producto)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

