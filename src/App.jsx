import React, { useState } from 'react';
import GlassBento from './GlassBento';
import { X, Send, Folder, User, Briefcase, Layers, Mail } from 'lucide-react';
 
const DATA_DETAIL = {
  main: {
    title: "Saya aku gw im",
    desc: "Halo! Saya adalah seorang pelajar yang meyukai robotika, pemrograman, dan segala hal yang berbau 2077. Hehe maap garing, ini demo yaa, kalo mau beli lahh :v",
    type: "text",
    icon: <User className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
  },
  dispersion: {
    title: "Project Showcase",
    desc: "Disini klo kamu udah beli, aku bisa taroin proyek proyek yang kamu mau disinii, biar dilirik dosen stt..",
    type: "gallery",
    icon: <Folder className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80"
    ]
  },
  transmission: {
    title: "Pengalaman",
    desc: "Ini bisa kustom jugaa, klo kamu dagangan gorengan aku bisa bikinin juga koo.",
    type: "experience",
    icon: <Briefcase className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />,
    history: [
      { year: "2025 - Sekarang", role: "Creative Frontend Dev", place: "Freelance / Remote" },
      { year: "2024", role: "UI Designer Intern", place: "Prism Lab Studio" }
    ]
  },
  iridescence: {
    title: "Layanan",
    desc: "Nih misal punya klien, enak klien kamu bisa liat keahlian kamu disini",
    type: "services",
    icon: <Layers className="text-amber-400 group-hover:scale-110 transition-transform" size={20} />,
    skills: ["Web 3D Development", "Interactive UI/UX", "Performance Optimization"]
  },
  refraction: {
    title: "Hubungi Saya",
    desc: "Nah ini bisa yaa, di kustom pakai email kamu, nanti orang yang ngirim pesen kekirim ke email kamu",
    type: "contact",
    icon: <Mail className="text-rose-400 group-hover:scale-110 transition-transform" size={20} />
  }
};
 
export default function App() {
  const [activeKey, setActiveKey] = useState(null);
  const [formStatus, setFormStatus] = useState('IDLE');
 
 
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('SUBMITTING');

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mdavbdoj", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('SUCCESS');
        form.reset(); // Mengosongkan form kembali setelah sukses
        setTimeout(() => {
          setFormStatus('IDLE');
          setActiveKey(null); // Otomatis menutup popup setelah sukses kirim
        }, 2000);
      } else {
        setFormStatus('ERROR');
      }
    } catch (error) {
      setFormStatus('ERROR');
    }
  };

  const getCanvasAnimationClass = () => {
    if (!activeKey) return 'scale-100 blur-none rotate-0 opacity-100';
    const base = 'scale-75 blur-md opacity-20 pointer-events-none ';
    switch (activeKey) {
      case 'main': return base + 'rotate-12 translate-x-24';
      case 'iridescence':
      case 'refraction': return base + '-rotate-12 -translate-x-24';
      case 'dispersion': return base + '-rotate-3 -translate-y-12';
      case 'transmission': return base + 'rotate-3 translate-y-12';
      default: return base + 'scale-50';
    }
  };
 
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none" style={{ background: '#040608' }}>
 
      {/* CANVAS 3D */}
      <div className={`w-full h-full absolute inset-0 transition-all cubic-bezier(0.25, 1, 0.3, 1) duration-1000 ${getCanvasAnimationClass()}`}>
        <GlassBento onSelectShard={(key) => setActiveKey(key)} />
      </div>
 
      {/* NAVBAR */}
      {!activeKey && (
        <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-6 z-10 pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            <span className="font-bold tracking-widest text-sm text-white/90">■ RDSG</span>
          </div>
        </header>
      )}
 
      {/* FOOTER */}
      {!activeKey && (
        <footer className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-8 py-6 text-xs text-neutral-600 z-10 pointer-events-none">
          <p>© racano</p>
          <p className="font-mono hidden sm:block">inspired_by_graceful_shards_of_glass</p>
        </footer>
      )}
 
      {/* OVERLAY BACKGROUND POPUP */}
      <div className={`absolute inset-0 flex justify-center items-center backdrop-blur-sm transition-all duration-500 z-20 ${
        activeKey ? 'bg-black/60 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* POPUP CONTAINER */}
        <div className={`relative max-w-md w-full mx-4 bg-[#090d12]/90 border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all cubic-bezier(0.34, 1.56, 0.64, 1) duration-500 text-white ${
          activeKey ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-32 scale-75 opacity-0'
        }`}>
          
          {activeKey && (
            <div className="group/popup">
              {/* Tombol Tutup */}
              <button
                onClick={() => setActiveKey(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all duration-300 cursor-pointer active:scale-90"
              >
                <X size={16} />
              </button>
 
              {/* Kepala Judul */}
              <div className="flex items-center gap-2.5 mb-2 group cursor-default">
                {DATA_DETAIL[activeKey]?.icon}
                <h2 className="text-2xl font-light text-white tracking-wide transition-colors duration-300 group-hover:text-neutral-200">
                  {DATA_DETAIL[activeKey]?.title}
                </h2>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4 cursor-default">
                {DATA_DETAIL[activeKey]?.desc}
              </p>
 
              {/* ─── KONTEN BERDASARKAN TIPE ─── */}
 
              {/* 1. TIPE: GALERI */}
              {DATA_DETAIL[activeKey]?.type === "gallery" && (
                <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {DATA_DETAIL[activeKey].images.map((src, index) => (
                    <div key={index} className="aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-neutral-900 group/img cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                      <img loading="lazy" src={src} alt="Project" className="w-full h-full object-cover opacity-70 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              )}
 
              {/* 2. TIPE: PENGALAMAN */}
              {DATA_DETAIL[activeKey]?.type === "experience" && (
                <div className="space-y-3 mt-2 border-l border-white/10 pl-3 ml-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {DATA_DETAIL[activeKey].history.map((item, index) => (
                    <div key={index} className="relative group/item cursor-default transition-all duration-300 hover:translate-x-1 before:absolute before:-left-[17px] before:top-1.5 before:w-2 before:h-2 before:bg-purple-500/50 group-hover/item:before:bg-purple-400 before:rounded-full before:transition-all">
                      <span className="text-[10px] font-mono text-purple-400/80 group-hover/item:text-purple-300 transition-colors">{item.year}</span>
                      <h4 className="text-sm font-medium text-neutral-200 group-hover/item:text-white transition-colors">{item.role}</h4>
                      <p className="text-xs text-neutral-500 group-hover/item:text-neutral-400 transition-colors">{item.place}</p>
                    </div>
                  ))}
                </div>
              )}
 
              {/* 3. TIPE: LAYANAN */}
              {DATA_DETAIL[activeKey]?.type === "services" && (
                <div className="flex flex-wrap gap-1.5 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {DATA_DETAIL[activeKey].skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-white/5 border border-white/5 text-neutral-400 px-3 py-1.5 rounded-lg font-mono cursor-default transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white hover:-translate-y-0.5">
                      ⚡ {skill}
                    </span>
                  ))}
                </div>
              )}
 
              {/* 4. TIPE: KONTAK (FORM ASLI & BERFUNGSI) */}
              {DATA_DETAIL[activeKey]?.type === "contact" && (
                <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {formStatus === 'SUCCESS' && (
                    <div className="text-center py-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-mono">
                      🚀 Pesan terkirim! Cek email kamu ya.
                    </div>
                  )}

                  {formStatus === 'ERROR' && (
                    <div className="text-center py-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-mono mb-2">
                      ❌ Gagal mengirim pesan. Coba lagi nanti.
                    </div>
                  )}

                  {formStatus !== 'SUCCESS' && (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <input 
                        type="text" 
                        name="name" // Name atribut wajib ada untuk Formspree
                        placeholder="Nama kamu" 
                        required
                        disabled={formStatus === 'SUBMITTING'}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white transition-all duration-300 outline-none focus:bg-white/[0.08] focus:border-rose-500/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)] disabled:opacity-50"
                      />
                      <input 
                        type="email" 
                        name="email" // Menggunakan type email asli agar datanya valid
                        placeholder="Email kamu" 
                        required
                        disabled={formStatus === 'SUBMITTING'}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white transition-all duration-300 outline-none focus:bg-white/[0.08] focus:border-rose-500/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)] disabled:opacity-50"
                      />
                      <textarea 
                        name="message" 
                        placeholder="Pesan atau ajakan kolaborasi..." 
                        rows="3"
                        required
                        disabled={formStatus === 'SUBMITTING'}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white transition-all duration-300 outline-none focus:bg-white/[0.08] focus:border-rose-500/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)] resize-none disabled:opacity-50"
                      />
                      <button 
                        type="submit"
                        disabled={formStatus === 'SUBMITTING'}
                        className="w-full bg-white text-black font-medium text-xs py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                      >
                        <Send size={12} /> {formStatus === 'SUBMITTING' ? 'Mengirim...' : 'Kirim Pesan'}
                      </button>
                    </form>
                  )}
                </div>
              )}
 
              {/* 5. TIPE: TEXT */}
              {DATA_DETAIL[activeKey]?.type === "text" && (
                <div className="text-xs font-mono text-neutral-500 bg-white/5 p-4 rounded-md border border-white/5 mt-2 cursor-default transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-neutral-400">
                  // Status: Ready to build amazing things.
                </div>
              )}
            </div>
          )}
 
        </div>
      </div>
 
    </div>
  );
}