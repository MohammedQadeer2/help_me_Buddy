import { useState } from "react";

import { motion } from "framer-motion";

import { useNavigate, useLocation } from "react-router-dom";

import { categories, providers } from "../data/mockData";

import ServiceCard from "../components/ServiceCard";



function Services() {

  const navigate = useNavigate();

  const location = useLocation();



  const initialCategory = location.state?.categoryStr || "all";

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState(initialCategory);

  const [sortOrder, setSortOrder] = useState("none");



  const filteredProviders = providers

    .filter((provider) => {

      const isAll = category === "all";

      const matchesCategory = provider.category.toLowerCase() === category.toLowerCase();

      const matchesSearch = provider.name.toLowerCase().includes(search.toLowerCase()) ||

                            provider.category.toLowerCase().includes(search.toLowerCase());

      return (isAll || matchesCategory) && matchesSearch;

    })

    .sort((a, b) => {

      if (sortOrder === "low") return a.price - b.price;

      if (sortOrder === "high") return b.price - a.price;

      return 0;

    });



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white font-system">

      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        

        {/* Header Area */}

        <div className="flex flex-col mb-8 lg:mb-12">

          <button

            onClick={() => navigate("/home")}

            className="self-start mb-6 px-5 py-2 bg-gray-900/80 hover:bg-gray-800 border border-gray-700/50 rounded-full text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"

          >

            &larr; Back

          </button>

          

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-tight mb-2">

            Find Professionals

          </h1>

          <p className="text-gray-400 text-sm sm:text-base font-medium">Browse and book top-rated experts in your area.</p>

        </div>



        {/* Sleek Search Bar */}

        <div className="relative mb-6 lg:mb-8 group">

          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">

            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>

          </div>

          <input

            type="text"

            placeholder="Search professionals, e.g. electrician..."

            className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-800/80 p-4 sm:p-5 pl-12 sm:pl-14 rounded-2xl text-sm sm:text-base outline-none placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-sm transition-all"

            value={search}

            onChange={(e) => setSearch(e.target.value)}

          />

        </div>



        {/* Categories Filter */}

        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          <button

            onClick={() => setCategory("all")}

            className="shrink-0 px-5 py-2.5 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all snap-start shadow-sm flex items-center gap-2"

          >

            All Services

          </button>



          {categories.map((cat) => (

            <button

              key={cat.id}

              onClick={() => setCategory(cat.name)}

              className="shrink-0 px-5 py-2.5 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all snap-start shadow-sm flex items-center gap-2"

            >

              <span className="text-lg">{cat.icon}</span> {cat.name}

            </button>

          ))}

        </div>



        {/* Sort by Price */}

        <div className="flex flex-wrap gap-3 mb-8">

          <span className="text-gray-500 text-sm font-semibold flex items-center mr-2 uppercase tracking-wider">Sort:</span>

          <button

            onClick={() => setSortOrder(sortOrder === "low" ? "none" : "low")}  

            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"

          >

            Price: Low to High

          </button>

          <button

            onClick={() => setSortOrder(sortOrder === "high" ? "none" : "high")}

            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"

          >

            Price: High to Low

          </button>

        </div>



        {/* Provider List */}

        <div className="space-y-4 sm:space-y-6">

          {filteredProviders.map((provider) => (

            <ServiceCard

              key={provider.id}

              provider={provider}

              onClick={() => navigate("/details", { state: { provider } })}     

            />

          ))}

        </div>



        {/* Empty State */}

        {filteredProviders.length === 0 && (

          <div className="text-center mt-12 bg-gray-900/40 p-10 sm:p-16 rounded-[2rem] border border-gray-800/50">

            <div className="text-5xl sm:text-6xl mb-4 opacity-50">Ã°Å¸â€Â</div>

            <p className="text-lg sm:text-xl text-gray-300 font-bold tracking-wide">No professionals found</p>

            <p className="text-sm sm:text-base text-gray-500 mt-2">Try adjusting your filters or search term.</p>

          </div>

        )}

      </div>

    </div>

  );

}



export default Services;



