import React, { useState, useEffect, useRef } from 'react';
import { duasData } from '../data/duas';

export default function DuaWebsite() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [darkMode, setDarkMode] = useState(false);
  const [savedDuas, setSavedDuas] = useState([]);
  const [playingTitle, setPlayingTitle] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const toggleFavorite = (title) => {
    if (savedDuas.includes(title)) {
      setSavedDuas(savedDuas.filter(item => item !== title));
    } else {
      setSavedDuas([...savedDuas, title]);
    }
  };

  const handlePlayAudio = (audioUrl, title) => {
    if (!audioUrl) {
      alert("দুঃখিত, এই দোয়ার অডিও ফাইলটি এখনো যুক্ত করা হয়নি!");
      return;
    }
    if (playingTitle === title) {
      audioRef.current.pause();
      setPlayingTitle(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(audioUrl);
    setPlayingTitle(title);
    audioRef.current.play().catch(error => {
      console.error("Audio play failed:", error);
      alert("অডিও প্লে করতে সমস্যা হয়েছে। দয়া করে লিংকটি চেক করুন।");
      setPlayingTitle(null);
    });

    audioRef.current.onended = () => {
      setPlayingTitle(null);
    };
  };

  const categories = ["সব", ...new Set(duasData.map(dua => dua.category))];

  const filteredDuas = duasData.filter((dua) => {
    const matchesCategory = selectedCategory === "সব" ||
      (selectedCategory === "পছন্দের" ? savedDuas.includes(dua.title) : dua.category === selectedCategory);

    const searchLower = searchQuery.toLowerCase().trim();
    return matchesCategory && (
      dua.title.toLowerCase().includes(searchLower) ||
      dua.meaning.toLowerCase().includes(searchLower) ||
      dua.pronunciation.toLowerCase().includes(searchLower) ||
      dua.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-emerald-50/60 via-white to-emerald-100/50 text-gray-950'}`}>

      {/* 1. ULTRA PREMIUM NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${darkMode ? 'bg-slate-950/80 border-slate-800/80 shadow-2xl' : 'bg-white/80 border-emerald-100/80 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
              Nur Dua
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 font-medium">Premium Islamic Resource</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all active:scale-95 text-lg sm:text-xl ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-emerald-50/60 border-emerald-100 text-emerald-800 hover:bg-emerald-100/70'
                }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-grow">

        {/* 2. RESPONSIVE HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <span className={`inline-flex gap-2 items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide ${darkMode ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60' : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200/60'}`}>
              🕌 ১০০% সহীহ দোয়া ভাণ্ডার
            </span>

            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight">
              সহজেই খুঁজে নিন আপনার <br className="hidden sm:inline" />
              <span className={`bg-gradient-to-r ${darkMode ? 'from-emerald-400 to-teal-300' : 'from-emerald-700 to-teal-600'} bg-clip-text text-transparent`}>আকাঙ্ক্ষিত দোয়া</span>।
            </h2>

            <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              আরবি, বাংলা উচ্চারণ ও বিশুদ্ধ অর্থসহ প্রয়োজনীয় দোয়ার এক আধুনিক ওয়েব প্ল্যাটফর্ম। নিচের লাইভ স্মার্ট সার্চবক্সে শুধু টাইপ করুন।
            </p>

            {/* ⚡ LIVE SMART SEARCH (মোবাইলে টাচ ফ্রেন্ডলি) */}
            <div className={`mt-8 sm:mt-10 shadow-xl rounded-[24px] p-1.5 border transition-all flex items-center gap-2 max-w-xl mx-auto lg:mx-0 ${darkMode ? 'bg-slate-900/90 border-slate-800 focus-within:border-emerald-500' : 'bg-white border-emerald-100 focus-within:border-emerald-600'}`}>
              <span className="pl-3 text-xl sm:text-2xl">🔍</span>
              <input
                type="text"
                placeholder="এখানে লিখুন (উদা: ঘুম, সফর, নামাজ, ghum)..."
                className="w-full bg-transparent outline-none text-sm sm:text-base py-2.5 text-gray-800 dark:text-slate-100 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="pr-3 text-xs font-bold text-gray-400 hover:text-rose-500 transition">Clear</button>
              )}
            </div>
          </div>

          {/* HERO CARD (আজকের দোয়া) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className={`shadow-2xl rounded-[32px] p-6 sm:p-8 border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-emerald-100/70'}`}>
              <div className="flex items-center justify-between">
                <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-amber-200/40 dark:border-amber-900/30">
                  ✨ নির্বাচিত দোয়া
                </span>
                <span className="text-gray-400 text-[11px] font-semibold tracking-wider uppercase">Daily Dua</span>
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-black">সকালের দোয়া</h3>
              <p className="mt-6 text-right text-2xl sm:text-3xl md:text-4xl leading-loose font-serif font-bold text-emerald-600 dark:text-emerald-400" dir="rtl">
                اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا
              </p>

              <button
                onClick={() => handlePlayAudio("", 'daily')}
                className={`mt-8 w-full py-3.5 rounded-2xl font-bold transition shadow-lg text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 ${playingTitle === 'daily' ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-700 hover:bg-emerald-800 text-white'}`}
              >
                {playingTitle === 'daily' ? '🛑 স্টপ করুন' : '🔊 অডিও তেলাওয়াত শুনুন'}
              </button>
            </div>
          </div>
        </section>

        {/* 3. RESPONSIVE POPULAR CATEGORIES */}
        <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">পপুলার ক্যাটাগরি</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-slate-400">ক্লিক করে নির্দিষ্ট বিষয়ের দোয়াগুলো দেখে নিন</p>
          </div>

          {/* হরিজন্টাল স্ক্রল স্ক্রিন (ছোট মোবাইলের জন্য বেস্ট ইউজার এক্সপেরিয়েন্স) */}
          <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 mt-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide snap-x">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-center border ${selectedCategory === category
                    ? "bg-emerald-700 text-white shadow-md border-emerald-700"
                    : `${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-emerald-100 text-emerald-800 hover:bg-emerald-50'}`
                  }`}
              >
                {category === "সব" ? "📚 সব দোয়া" : `☪ ${category}`}
              </button>
            ))}
            <button
              onClick={() => setSelectedCategory("পছন্দের")}
              className={`px-4.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-center border ${selectedCategory === "পছন্দের"
                  ? "bg-rose-600 text-white shadow-md border-rose-600"
                  : `${darkMode ? 'bg-slate-900 border-slate-800 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-800'}`
                }`}
            >
              ❤️ পছন্দের ({savedDuas.length})
            </button>
          </div>
        </section>

        {/* 4. DYNAMIC DUA CARDS AREA */}
        <section id="duas" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          {filteredDuas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDuas.map((dua, index) => {
                const isFavorite = savedDuas.includes(dua.title);
                return (
                  <div
                    key={index}
                    className={`rounded-[28px] p-5 sm:p-7 shadow-xl border flex flex-col justify-between hover:shadow-2xl md:hover:-translate-y-1.5 transition-all duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white border-emerald-100/60'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold ${darkMode ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-50 text-emerald-800'}`}>
                          {dua.category}
                        </span>
                        <button onClick={() => toggleFavorite(dua.title)} className="text-xl sm:text-2xl p-1 transition-transform active:scale-75">
                          {isFavorite ? '❤️' : '♡'}
                        </button>
                      </div>

                      <h3 className="mt-5 text-lg sm:text-xl font-extrabold tracking-tight">{dua.title}</h3>
                      <p className="mt-6 text-right text-2xl sm:text-3xl leading-loose font-serif font-bold text-emerald-600 dark:text-emerald-400" dir="rtl">
                        {dua.arabic}
                      </p>

                      <div className="mt-6 space-y-4 border-t border-gray-100 dark:border-slate-800/60 pt-4">
                        <div className="text-xs sm:text-sm">
                          <span className="font-black text-[10px] uppercase tracking-wider text-emerald-500 block mb-1">উচ্চারণ</span>
                          <p className="text-gray-700 dark:text-slate-300 italic font-medium leading-relaxed">{dua.pronunciation}</p>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <span className="font-black text-[10px] uppercase tracking-wider text-emerald-500 block mb-1">অর্থ</span>
                          <p className="text-gray-600 dark:text-slate-400 font-medium leading-relaxed">{dua.meaning}</p>
                        </div>
                      </div>
                    </div>

                    {/* রেসপনসিভ অ্যাকশন বাটন */}
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => handlePlayAudio(dua.audio, dua.title)}
                        className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${playingTitle === dua.title ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          }`}
                      >
                        {playingTitle === dua.title ? '🛑 Stop' : '🔊 Play Audio'}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${dua.title}\n\nआरবি: ${dua.arabic}\n\nউচ্চারণ: ${dua.pronunciation}\n\nঅর্থ: ${dua.meaning}`);
                          alert("দোয়াটি কপি করা হয়েছে!");
                        }}
                        className={`flex-1 border py-3 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                          }`}
                      >
                        🔗 Copy Dua
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl">🍃</span>
              <p className="text-sm font-bold text-gray-400 mt-2">কোনো দোয়া খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}
        </section>
      </main>

      {/* 5. PREMIUM RESPONSIVE FOOTER (নতুন অ্যাড করা হয়েছে) */}
      <footer className={`mt-auto border-t transition-colors duration-300 ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-emerald-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className={`text-lg font-black tracking-tight ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>Nur Dua</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium mt-1">
              &copy; {new Date().getFullYear()} Nur Dua. All Rights Reserved.
            </p>
          </div>

          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Designed & Developed by <span className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>MD Ahbab Hussain Arabi</span>
          </p>

          <div className="flex gap-5 text-xs font-bold text-gray-400 dark:text-slate-500">
            <a href="#" className="hover:text-emerald-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition">Terms of Use</a>
          </div>
        </div>
      </footer>

    </div>
  );
}