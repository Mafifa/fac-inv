import React, { useState, useCallback, useMemo } from 'react';
import { useInventario } from './useInventory';
import { useAppContext } from '../../context/appContext'
import { Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight, Loader, EyeOff } from 'lucide-react';
import ModalProducto from './modalProducto';
import ModalOferta from './modalOferta';
import BarraBusqueda from './barraBusqueda';

const Inventario: React.FC = () => {
  const { getTasaCambio } = useAppContext()

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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button
          onClick={() => setPaginaActual(1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="inventario bg-gray-100 px-6 -mt-1">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <BarraBusqueda onSearch={handleSearch} initialValue={busqueda} />
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Producto
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['ID', 'Nombre', 'Precio (USD)', 'Precio (Bs)', 'Stock', 'Descuento', 'Acciones'].map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto.id_producto} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.id_producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${producto.precio_base.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(producto.precio_base * getTasaCambio("inventario")).toFixed(2)} Bs</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.descuento ? `${producto.descuento.toFixed(2)}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setProductoEditando(producto);
                                setModalAbierto(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                              title="Editar"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDisableProducto(producto.id_producto)}
                              className="text-yellow-600 hover:text-yellow-900 transition duration-150 ease-in-out"
                              title="Deshabilitar"
                            >
                              <EyeOff className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProducto(producto.id_producto)}
                              className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setProductoOferta(producto);
                                setModalOfertaAbierto(true);
                              }}
                              className="text-green-600 hover:text-green-900 transition duration-150 ease-in-out"
                              title="Oferta"
                            >
                              <Tag className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPaginaActual(Math.max(paginaActual - 1, 1))}
                disabled={paginaActual === 1}
                className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(Math.min(paginaActual + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
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

