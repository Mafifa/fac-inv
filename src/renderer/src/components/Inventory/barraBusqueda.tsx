import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface BarraBusquedaProps {
  onSearch: (query: string) => void;
  initialValue: string;
  isDarkMode: boolean;
}

const BarraBusqueda: React.FC<BarraBusquedaProps> = ({ onSearch, initialValue, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
          ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
      />
      <button
        type="submit"
        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

export default BarraBusqueda;

