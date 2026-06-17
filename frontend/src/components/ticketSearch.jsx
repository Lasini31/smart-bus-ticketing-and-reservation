import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx'
import getOnBus from '../../public/icons/getOnBus.png'
import getOutBus from '../../public/icons/getOutBus.png'

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
  const { messages } = useLanguage()
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

  // Swap locations
  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    onSearch({
      from: to.toLowerCase(),
      to: temp.toLowerCase(),
      startDate,
      travelers
    });
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
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Section 1: Select Locations */}
        <div className="flex-1 bg-white shadow-lg pl-6 pr-6 pt-2 pb-2 rounded-lg">
          <div className="flex flex-col md:flex-row items-end gap-3">
            {/* From Location */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">{messages.search?.from || 'From'}</label>
                <div className="flex items-center border-b-2 border-gray-300 pb-2">
                  <img src={getOnBus} className='w-8 h-8 mr-2'/>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => handleFromChange(e.target.value)}
                    onFocus={() => from.length > 0 && setShowFromSuggestions(true)}
                    placeholder={messages.search?.placeholderFrom || 'Select location'}
                    className="w-full outline-none text-sm font-medium"
                    autoComplete="off"
                  />
                </div>
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-300 mt-1 shadow-lg z-10 rounded">
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

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="bg-white border-2 border-gray-300 rounded-full p-3 hover:bg-gray-50 transition flex-shrink-0 self-center md:self-auto"
              title="Swap locations"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
              </svg>
            </button>

            {/* To Location */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">{messages.search?.to || 'To'}</label>
                <div className="flex items-center border-b-2 border-gray-300 pb-2">
                  <img src={getOutBus} className='w-8 h-8 mr-2'/>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => handleToChange(e.target.value)}
                    onFocus={() => to.length > 0 && setShowToSuggestions(true)}
                    placeholder={messages.search?.placeholderTo || 'Select location'}
                    className="w-full outline-none text-sm font-medium"
                    autoComplete="off"
                  />
                </div>
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-300 mt-1 shadow-lg z-10 rounded">
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
          </div>
        </div>

        {/* Section 2: Select Date */}
        <div className="flex-1 bg-white shadow-lg pl-6 pr-6 pt-2 pb-2 rounded-lg">
          <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase">{messages.search?.date || 'Select Date'}</label>
          <div className="flex items-center border-b-2 border-gray-300 pb-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleSearch();
              }}
              className="w-full outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Section 3: Set Travelers */}
        <div className="flex-1 bg-white shadow-lg pl-6 pr-6 pt-2 pb-2 rounded-lg">
          <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase">{messages.search?.travelers || 'Number of Travelers'}</label>
          <div className="flex items-center gap-4 pb-2 ">
            <input
              type="number"
              value={travelers}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setTravelers('');
                  return;
                }
                if (isNaN(value)) return;
                const newTravelers = Math.min(10, Math.max(1, parseInt(value)));
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              onBlur={() => {
                if (travelers === '' || travelers < 1) {
                  setTravelers(1);
                  handleSearch(1);
                }
              }}
              className="w-35 text-center outline-none font-bold text-lg border-b-2 border-gray-300"
              min="1"
              max="10"
            />
            <button
              onClick={() => {
                const newTravelers = Math.max(1, travelers - 1);
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              className="flex-shrink-0 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold w-10 h-10 rounded-full flex items-center justify-center transition text-lg"
            >
              −
            </button>
            <button
              onClick={() => {
                const newTravelers = Math.min(10, travelers + 1);
                setTravelers(newTravelers);
                handleSearch(newTravelers);
              }}
              className="flex-shrink-0 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold w-10 h-10 rounded-full flex items-center justify-center transition text-lg"
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
        className="mt-6 text-green-600 hover:text-green-700 font-semibold text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}