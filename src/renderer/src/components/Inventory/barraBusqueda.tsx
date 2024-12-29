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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query.trim() === '') return;

    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  );
};

export default BarraBusqueda;

