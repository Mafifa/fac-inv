import React, { useState, useCallback, useMemo } from 'react';
import { useInventario } from './useInventory';
import { useDolarContext } from '../../context/dolarContext'
import { Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight, Loader, EyeOff } from 'lucide-react';
import ModalProducto from './modalProducto';
import ModalOferta from './modalOferta';
import BarraBusqueda from './barraBusqueda';

const Inventario: React.FC = () => {
  const { promedio } = useDolarContext()

  const {
    productos,
    totalProductos,
    paginaActual,
    setPaginaActual,
    busqueda,
    addProducto,
    updateProducto,
    disableProducto,
    deleteProducto,
    searchProductos,
    isLoading,
    error
  } = useInventario();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalOfertaAbierto, setModalOfertaAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [productoOferta, setProductoOferta] = useState<Producto | null>(null);

  const handleAddProducto = useCallback((producto: Producto) => {
    addProducto(producto);
    setModalAbierto(false);
  }, [addProducto]);

  const handleUpdateProducto = useCallback((producto: Producto) => {
    updateProducto(producto);
    setModalAbierto(false);
  }, [updateProducto]);

  const handleDisableProducto = useCallback((id: number) => {
    disableProducto(id);
  }, [disableProducto]);

  const handleDeleteProducto = useCallback((id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
      deleteProducto(id);
    }
  }, [deleteProducto]);

  const handleSearch = useCallback((query: string) => {
    searchProductos(query);
  }, [searchProductos]);

  const productosPorPagina = 7;
  const totalPaginas = useMemo(() => Math.ceil(totalProductos / productosPorPagina), [totalProductos]);

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => setPaginaActual(1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="inventario">
      <div className="mb-4 flex justify-between items-center">
        <BarraBusqueda onSearch={handleSearch} initialValue={busqueda} />
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          <Plus className="h-5 w-5 inline-block mr-2" />
          Agregar Producto
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio (USD)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio (Bs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.id_producto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${producto.precio_base.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(producto.precio_base * promedio).toFixed(2)} Bs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.descuento ? `${producto.descuento.toFixed(2)}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setProductoEditando(producto);
                          setModalAbierto(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDisableProducto(producto.id_producto)}
                        className="text-yellow-600 hover:text-yellow-800 mr-2"
                      >
                        <EyeOff className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProducto(producto.id_producto)}
                        className="text-red-600 hover:text-red-800 mr-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setProductoOferta(producto);
                          setModalOfertaAbierto(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Tag className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPaginaActual(Math.max(paginaActual - 1, 1))}
              disabled={paginaActual === 1}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => setPaginaActual(Math.min(paginaActual + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
      <ModalProducto
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setProductoEditando(null);
        }}
        onSave={productoEditando ? handleUpdateProducto : handleAddProducto}
        producto={productoEditando}
      />
      <ModalOferta
        isOpen={modalOfertaAbierto}
        onClose={() => {
          setModalOfertaAbierto(false);
          setProductoOferta(null);
        }}
        producto={productoOferta}
        onSave={handleUpdateProducto}
      />
    </div>
  );
};

export default Inventario;

