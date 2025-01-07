import React, { useState, useCallback, useMemo } from 'react';
import { useInventario } from './useInventory';
import { useAppContext } from '../../context/appContext'
import { Plus, Pencil, Trash2, Tag, ChevronLeft, ChevronRight, Loader, EyeOff } from 'lucide-react';
import ModalProducto from './modalProducto';
import ModalOferta from './modalOferta';
import BarraBusqueda from './barraBusqueda';

const Inventario: React.FC = () => {
  const { getTasaCambio, config } = useAppContext()
  const isDarkMode = config.modoOscuro;

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
      <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <p className={`text-xl mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        <button
          onClick={() => setPaginaActual(1)}
          className={`px-6 py-2 rounded-lg transition duration-300 shadow-lg ${isDarkMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={`inventario px-6 -mt-1 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100   text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <BarraBusqueda onSearch={handleSearch} initialValue={busqueda} isDarkMode={isDarkMode} />
            <button
              onClick={() => setModalAbierto(true)}
              className={`px-4 py-2 whitespace-nowrap rounded-lg transition duration-300 shadow-md flex items-center ${isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Producto
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className={`animate-spin h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        ) : (
          <>
            <div className={`shadow-lg rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      {['ID', 'Nombre', 'Precio (USD)', 'Precio (Bs)', 'Stock', 'Descuento', 'Acciones'].map((header) => (
                        <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {productos.map((producto) => (
                      <tr key={producto.id_producto} className={`transition duration-150 ease-in-out ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{producto.id_producto}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{producto.nombre}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>${producto.precio_base.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{(producto.precio_base * getTasaCambio("inventario")).toFixed(2)} Bs</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{producto.stock}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {producto.descuento ? `${producto.descuento.toFixed(2)}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setProductoEditando(producto);
                                setModalAbierto(true);
                              }}
                              className={`transition duration-150 ease-in-out ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'
                                }`}
                              title="Editar"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDisableProducto(producto.id_producto)}
                              className={`transition duration-150 ease-in-out ${isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-900'
                                }`}
                              title="Deshabilitar"
                            >
                              <EyeOff className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProducto(producto.id_producto)}
                              className={`transition duration-150 ease-in-out ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                                }`}
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setProductoOferta(producto);
                                setModalOfertaAbierto(true);
                              }}
                              className={`transition duration-150 ease-in-out ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'
                                }`}
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
                className={`flex items-center px-4 py-2 border text-sm font-medium rounded-md ${isDarkMode
                  ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Anterior
              </button>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(Math.min(paginaActual + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className={`flex items-center px-4 py-2 border text-sm font-medium rounded-md ${isDarkMode
                  ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
        isDarkMode={isDarkMode}
      />
      <ModalOferta
        isOpen={modalOfertaAbierto}
        onClose={() => {
          setModalOfertaAbierto(false);
          setProductoOferta(null);
        }}
        producto={productoOferta}
        onSave={handleUpdateProducto}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Inventario;

