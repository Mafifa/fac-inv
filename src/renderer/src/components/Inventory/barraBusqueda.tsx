import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface BarraBusquedaProps {
  onSearch: (query: string) => void;
  initialValue: string;
}

const BarraBusqueda: React.FC<BarraBusquedaProps> = ({ onSearch, initialValue }) => {
  const [query, setQuery] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpia el temporizador previo
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Si el query está vacío, no ejecuta la búsqueda
    if (query.trim() === '') return;

    // Configura un nuevo temporizador con debounce
    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);

    // Limpieza del temporizador al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, onSearch]);

  return (
    <div className="flex items-center w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => onSearch(query)}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BarraBusqueda;
