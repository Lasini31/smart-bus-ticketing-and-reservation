import { useState } from 'react';

const PLACES = [
  'Colombo',
  'Kandy',
  'Galle',
  'Matara',
  'Jaffna',
  'Trincomalee',
  'Batticaloa',
  'Negombo',
  'Kurunagala',
  'Ratnapura',
  'Nuwara Eliya',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Ampara'
];

export default function TicketSearch({ onSearch }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleSearch = (updatedTravelers = travelers) => {
    onSearch({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      startDate,
      travelers: updatedTravelers
    });
  };

  // Trigger search on every input change
  const handleInputChange = () => {
    handleSearch();
  };

  // Handle From location input with suggestions
  const handleFromChange = (value) => {
    setFrom(value);
    if (value.length > 0) {
      const filtered = PLACES.filter(place =>
        place.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
    // Trigger search with updated from value
    onSearch({
      from: value.toLowerCase(),
      to: to.toLowerCase(),
      startDate,
      travelers
    });
  };

  // Handle To location input with suggestions
  const handleToChange = (value) => {
    setTo(value);
    if (value.length > 0) {
      const filtered = PLACES.filter(place =>
        place.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
    // Trigger search with updated to value
    onSearch({
      from: from.toLowerCase(),
      to: value.toLowerCase(),
      startDate,
      travelers
    });
  };

  // Select from suggestion
  const selectFromPlace = (place) => {
    setFrom(place);
    setShowFromSuggestions(false);
    onSearch({
      from: place.toLowerCase(),
      to: to.toLowerCase(),
      startDate,
      travelers
    });
  };

  // Select to suggestion
  const selectToPlace = (place) => {
    setTo(place);
    setShowToSuggestions(false);
    onSearch({
      from: from.toLowerCase(),
      to: place.toLowerCase(),
      startDate,
      travelers
    });
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* From Location */}
        <div className='bg-white shadow-md p-2 rounded-lg'>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2">
              <span className="text-gray-400 mr-2">📍</span>
              <input
                type="text"
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
                onFocus={() => from.length > 0 && setShowFromSuggestions(true)}
                placeholder="From location"
                className="w-full outline-none text-sm"
                autoComplete="off"
              />
            </div>
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {fromSuggestions.map((place, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectFromPlace(place)}
                    className="w-full text-left px-3 py-2 hover:bg-green-100 text-sm text-gray-700 border-b last:border-b-0 transition"
                  >
                    📍 {place}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* To Location */}
        <div className='bg-white shadow-md p-2 rounded-lg'>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2">
              <span className="text-gray-400 mr-2">📍</span>
              <input
                type="text"
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
                onFocus={() => to.length > 0 && setShowToSuggestions(true)}
                placeholder="To location"
                className="w-full outline-none text-sm"
                autoComplete="off"
              />
            </div>
            {showToSuggestions && toSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {toSuggestions.map((place, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectToPlace(place)}
                    className="w-full text-left px-3 py-2 hover:bg-green-100 text-sm text-gray-700 border-b last:border-b-0 transition"
                  >
                    📍 {place}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Start Date */}
        <div className='bg-white shadow-md p-2 rounded-lg'>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleSearch();
            }}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 outline-none text-sm"
          />
        </div>

        {/* Travelers */}
        <div className='bg-white shadow-md p-2 rounded-lg'>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Travelers
          </label>
          <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2">
            <button
              onClick={() => {
                const newTravelers = Math.max(1, travelers - 1);
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={travelers}
              onChange={(e) => {
                const newTravelers = Math.max(1, parseInt(e.target.value) || 1);
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              className="w-full text-center outline-none mx-2"
              min="1"
            />
            <button
              onClick={() => {
                const newTravelers = travelers + 1;
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setFrom('');
          setTo('');
          setStartDate('');
          setTravelers(1);
          onSearch({
            from: '',
            to: '',
            startDate: '',
            travelers: 1
          });
        }}
        className="mt-4 text-green-600 hover:text-green-700 font-semibold text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}