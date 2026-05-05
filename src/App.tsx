import { useState, useEffect, FormEvent } from 'react';
import { 
  Menu, X, ChevronRight, Phone, Mail, MapPin, 
  Instagram, Facebook, Clock, Trophy, Users, 
  Dumbbell, Utensils, Calendar, Smartphone,
  ExternalLink, ArrowRight, Loader2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Components ---

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'Inicio', href: pathname === '/' ? '#inicio' : '/' },
    { name: 'El Club', href: pathname === '/' ? '#club' : '/#club' },
    { name: 'Deportes', href: '/deportes', isPage: true },
    { name: 'Directorio', href: '/directorio', isPage: true },
    { name: 'Restaurante', href: pathname === '/' ? '#restaurante' : '/#restaurante' },
    { name: 'Contacto', href: pathname === '/' ? '#contacto' : '/#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy text-white h-20 flex items-center justify-between px-6 md:px-12 border-b-4 border-gold shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center font-serif text-2xl font-bold italic text-navy">L</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none uppercase">Club del Lago</h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-medium">Excelencia y Tradición</p>
          </div>
        </Link>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden lg:flex gap-8 text-xs font-semibold uppercase tracking-widest">
        {navLinks.map((link) => (
          link.isPage ? (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`hover:text-gold transition-colors ${pathname === link.href ? 'text-gold' : ''}`}
            >
              {link.name}
            </Link>
          ) : (
            <a 
              key={link.name} 
              href={link.href} 
              className="hover:text-gold transition-colors"
            >
              {link.name}
            </a>
          )
        ))}
      </nav>

      <div className="hidden md:block">
        <button className="btn-outline">
          Acceso Socios
        </button>
      </div>

      {/* Mobile Toggle */}
      <button 
        className="lg:hidden p-2 text-gold" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-navy border-b-4 border-gold overflow-hidden lg:hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-center text-xs font-bold uppercase tracking-widest">
              {navLinks.map((link) => (
                link.isPage ? (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gold"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gold"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <button className="btn-outline w-full">
                Solicitar Membresía
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="inicio" className="relative h-[80vh] md:h-[70vh] flex items-center overflow-hidden bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col md:flex-row gap-8 py-8">
        {/* Left Column: Hero Content */}
        <div className="md:w-3/5 relative rounded-sm overflow-hidden bg-slate-200 border border-slate-100 flex flex-col">
          <div className="absolute inset-0 hero-gradient opacity-60 z-10"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20 text-white">
            <span className="text-gold font-bold text-sm tracking-widest uppercase mb-2">Bienvenidos a su segundo hogar</span>
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight">La elegancia del deporte en un entorno natural único</h2>
            <p className="text-sm text-slate-200 max-w-md leading-relaxed mb-8">
              Disfrute de las mejores instalaciones deportivas y sociales de Monterrey. Un espacio diseñado para el bienestar y la integración de toda su familia.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">Ver Membresías</button>
              <button className="text-white text-xs font-bold uppercase tracking-widest border-b border-gold pb-1 hover:text-gold transition-colors">Ver Instalaciones</button>
            </div>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1540339832862-4745299807c3?q=80&w=2574&auto=format&fit=crop" 
            alt="Club Layout" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Featured Section */}
        <div className="md:w-2/5 flex flex-col gap-6">
          <div className="bg-navy p-8 text-white flex-grow relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-gold font-bold uppercase text-xs tracking-widest mb-4 italic">Excelencia desde 1981</h3>
              <h4 className="text-3xl font-serif italic mb-4">Gastronomía y Vida Social</h4>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed italic">
                Descubra la armonía perfecta entre el deporte de alto rendimiento y la convivencia familiar de primer nivel.
              </p>
              <button className="bg-white text-navy px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
                Reservar Mesa
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 w-64 h-64 border-8 border-white rounded-full"></div>
          </div>

          <div className="bg-white border border-slate-200 p-8">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-navy font-bold uppercase text-xs tracking-widest">Próximos Eventos</h3>
              <span className="text-[10px] text-forest font-bold underline cursor-pointer">Ver todos</span>
            </div>
            <div className="space-y-5">
              <div className="flex gap-4 border-b border-slate-100 pb-4">
                <div className="text-center shrink-0">
                  <span className="block text-lg font-bold text-navy leading-none">15</span>
                  <span className="text-[9px] uppercase text-slate-400">Mayo</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Torneo de Aniversario - Inscripciones abiertas.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center shrink-0">
                  <span className="block text-lg font-bold text-navy leading-none">22</span>
                  <span className="text-[9px] uppercase text-slate-400">Mayo</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Cena Maridaje: Selección de Vinos Premium.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="club" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-gold font-bold tracking-widest text-sm uppercase mb-3 block">Nuestra Esencia</span>
              <h2 className="text-4xl md:text-5xl text-navy leading-tight font-serif italic lowercase first-letter:uppercase">
                Tradición forjada con excelencia
              </h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed italic">
              Desde 1981, el Club Del Lago es una asociación civil dedicada a promover la sana convivencia familiar. Comprometidos con el bienestar y la comunidad, nos consolidamos como un club de referencia en Monterrey.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 accent-border-l-forest">
                <h3 className="text-navy font-bold uppercase text-[11px] mb-2">Misión</h3>
                <p className="text-xs text-slate-500 italic">Fomentar la integración y el desarrollo integral de nuestros socios.</p>
              </div>
              <div className="bg-slate-50 p-6 accent-border-l-gold">
                <h3 className="text-navy font-bold uppercase text-[11px] mb-2">Visión</h3>
                <p className="text-xs text-slate-500 italic">Ser reconocidos por la calidad de clase mundial en cada servicio.</p>
              </div>
              <div className="bg-slate-50 p-6 accent-border-l-navy">
                <h3 className="text-navy font-bold uppercase text-[11px] mb-2">Trayectoria</h3>
                <p className="text-xs text-slate-500 italic">40+ años siendo el corazón del bienestar deportivo en la ciudad.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden border border-slate-100 p-2 bg-white shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1595152230535-00c14902161b?q=80&w=2670&auto=format&fit=crop" 
                alt="Comunidad" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Geometric Accent */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border-4 border-gold opacity-20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-4 border-forest opacity-20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Sports = () => {
  const sports = [
    { title: 'Tenis & Pádel', desc: '12 canchas profesionales con iluminación de última generación.', border: 'accent-border-l-forest' },
    { title: 'Natación', desc: 'Alberca techada y climatizada para entrenamiento y recreación.', border: 'accent-border-l-gold' },
    { title: 'Gimnasio', desc: 'Equipamiento de alto rendimiento y asesoría personalizada.', border: 'accent-border-l-navy' },
    { title: 'Fútbol', desc: 'Campos de primer nivel para torneos y práctica familiar.', border: 'accent-border-l-forest' },
    { title: 'Yoga & Box', desc: 'Espacios diseñados para el equilibrio físico y mental.', border: 'accent-border-l-gold' },
    { title: 'Fitness', desc: 'Programas especializados para todas las edades.', border: 'accent-border-l-navy' },
  ];

  return (
    <section id="deportes" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-gold font-bold tracking-widest text-sm uppercase mb-3 block">Disciplinas Deportivas</span>
            <h2 className="text-4xl md:text-5xl text-navy font-serif italic lowercase first-letter:uppercase leading-tight">Excelencia en cada disciplina</h2>
          </div>
          <button className="text-navy text-xs font-bold uppercase tracking-widest border-b border-gold pb-1 hover:text-gold transition-colors">
            Ver todas las actividades
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport, idx) => (
            <motion.div 
              key={sport.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white p-8 rounded-sm shadow-sm border border-slate-100 ${sport.border} hover:-translate-y-1 transition-all duration-300`}
            >
              <h3 className="text-navy font-bold uppercase text-lg mb-4">{sport.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 italic">{sport.desc}</p>
              <button className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Conocer más <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Restaurant = () => {
  return (
    <section id="restaurante" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <span className="text-gold font-bold uppercase text-xs tracking-widest mb-4 italic block">Vida Social</span>
          <h2 className="text-4xl md:text-5xl text-navy font-serif italic mb-8 leading-tight lowercase first-letter:uppercase">Gastronomía & Eventos</h2>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-1 bg-gold h-full self-stretch"></div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-navy">Restaurante La Terraza</p>
                <p className="text-xs text-slate-500 italic">Desayunos y comidas con vista privilegiada a nuestras áreas verdes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1 bg-gold h-full self-stretch"></div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-navy">Snack & Pool Bar</p>
                <p className="text-xs text-slate-500 italic">Opciones ligeras y refrescantes para disfrutar en familia junto a la alberca.</p>
              </div>
            </div>
          </div>

          <button className="btn-primary">Reservar Mesa</button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 h-full"
        >
          <div className="space-y-4">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2670&auto=format&fit=crop" className="rounded-sm h-64 w-full object-cover border border-slate-100" alt="Restaurant" />
            <div className="bg-forest/10 p-6 flex items-center justify-center border-l-4 border-forest">
               <span className="text-forest font-bold uppercase text-[10px] tracking-widest text-center">Insumos de <br/> Primera Calidad</span>
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2622&auto=format&fit=crop" className="rounded-sm h-44 w-full object-cover border border-slate-100" alt="Drink" />
            <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop" className="rounded-sm h-64 w-full object-cover border border-slate-100" alt="Meal" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AppBanner = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-navy p-12 md:p-20 rounded-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border-b-4 border-gold">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl text-gold mb-6 font-serif italic">Lleva el Club en tu bolsillo</h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed italic">
              Con DelagoApp podrá consultar horarios, reservar canchas y recibir comunicados oficiales al instante. Diseñada para su comodidad.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-navy px-8 py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-gold hover:text-white transition-all">
                Download App Store
              </button>
              <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-navy transition-all">
                Download Google Play
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <div className="w-64 h-[500px] bg-slate-800 rounded-[2rem] border-8 border-navy shadow-2xl relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-navy rounded-b-xl" />
               <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gold rounded-sm mb-4 flex items-center justify-center font-serif text-3xl font-bold italic text-navy">L</div>
                  <h4 className="text-white font-bold uppercase tracking-widest">Club del Lago</h4>
                  <p className="text-gold text-[10px] uppercase font-bold mt-2">Mobile Portal</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('error');
    }
  };

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <span className="text-gold font-bold tracking-widest text-sm uppercase mb-3 block">Estemos en contacto</span>
              <h2 className="text-4xl md:text-5xl text-navy mb-6 font-serif italic lowercase first-letter:uppercase">¿En qué podemos ayudarle?</h2>
              <p className="text-slate-500 italic">Nuestro equipo administrativo está a su disposición para resolver cualquier duda sobre membresías o servicios del Club.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-slate-50 rounded-sm flex items-center justify-center shrink-0 border-l-4 border-gold">
                  <MapPin size={18} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1 text-[11px] uppercase tracking-wider">Ubicación</h4>
                  <p className="text-slate-600 text-xs italic">Priv. del Lago #200, Col. Del Paseo Residencial, Monterrey, N.L.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-slate-50 rounded-sm flex items-center justify-center shrink-0 border-l-4 border-gold">
                  <Phone size={18} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1 text-[11px] uppercase tracking-wider">Teléfono Directo</h4>
                  <p className="text-slate-600 text-xs italic">81 9689 5727</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-slate-50 rounded-sm flex items-center justify-center shrink-0 border-l-4 border-gold">
                  <Clock size={18} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1 text-[11px] uppercase tracking-wider">Atención de Socios</h4>
                  <p className="text-slate-600 text-xs italic">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
             <form onSubmit={handleSubmit} className="bg-white p-10 rounded-sm border border-slate-200">
               <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-navy uppercase tracking-[0.2em]">Nombre Completo</label>
                   <input 
                     required
                     type="text" 
                     placeholder="Ej. Juan Pérez" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-sm px-4 py-3 focus:border-gold outline-none transition-all text-sm italic" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-navy uppercase tracking-[0.2em]">Correo Electrónico</label>
                   <input 
                     required
                     type="email" 
                     placeholder="email@ejemplo.mx" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-sm px-4 py-3 focus:border-gold outline-none transition-all text-sm italic" 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                   />
                 </div>
               </div>
               <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-[0.2em]">Mensaje o Consulta</label>
                  <textarea 
                    required
                    rows={4} 
                    placeholder="Estimado Club del Lago..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-sm px-4 py-3 focus:border-gold outline-none transition-all text-sm italic resize-none" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
               </div>
               
               <button 
                 disabled={status === 'submitting'}
                 className="w-full btn-primary bg-navy text-white hover:bg-gold flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {status === 'submitting' ? (
                   <>Enviando... <Loader2 className="animate-spin" size={16} /></>
                 ) : status === 'success' ? (
                   <>Mensaje Enviado <CheckCircle2 size={16} /></>
                 ) : (
                   'Enviar Formulario de Contacto'
                 )}
               </button>
               
               {status === 'error' && (
                 <p className="mt-4 text-red-500 text-[10px] font-bold uppercase text-center">Hubo un error al enviar el mensaje. Por favor intente más tarde.</p>
               )}
             </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200 text-[10px] text-slate-500 uppercase tracking-widest italic">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center font-serif text-lg font-bold italic text-navy">L</div>
             <span className="font-display font-bold text-navy text-sm">Club del Lago</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-navy transition-colors">Aviso de Privacidad</a>
            <a href="#" className="hover:text-navy transition-colors">Reglamento Interno</a>
            <a href="#" className="hover:text-navy transition-colors">Sugerencias</a>
          </div>

          <div className="flex gap-4">
            <Instagram size={16} className="cursor-pointer hover:text-gold transition-colors" />
            <Facebook size={16} className="cursor-pointer hover:text-gold transition-colors" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-8 text-slate-400">
          <div className="flex gap-8">
            <span>T: 81 9689 5727</span>
            <span>E: info@clubdelago.com.mx</span>
          </div>
          <p>© 2026 Club del Lago Monterrey. Excelencia y Tradición.</p>
        </div>
      </div>
    </footer>
  );
};

const Directory = () => {
  const staff = [
    { name: 'Esteban Gonzalez', position: 'Gerente General', email: 'gerenciagral@clubdelago.com.mx', note: 'Para comunicarse con Gerencia General, favor de contactar a Sandra Arévalo.' },
    { name: 'Sandra Arévalo', position: 'Atención a Asociados', email: 'atencionaasociados@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1008' },
    { name: 'Mayra Sánchez', position: 'Gerente Administrativo', email: 'msanchez@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1004' },
    { name: 'Mario Saenz', position: 'Gerente de Mantenimiento', email: 'Gmantenimiento@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1010' },
    { name: 'Vacante', position: 'Gerente de Alimentos y Bebidas', phone: '81 9689 5727' },
    { name: 'Juan Andrade', position: 'Jefe de Sistemas y Comunicación', email: 'sistemas@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1018' },
    { name: 'Vacante', position: 'Gerente de Capital Humano', phone: '81 9689 5727' },
    { name: 'Daniel Gonzalez', position: 'Coordinador de Eventos', email: 'eventos@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1016' },
    { name: 'Valeria Lopez', position: 'Comunicación', email: 'edicion@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1019' },
    { name: 'Ramon Garza', position: 'Gerente de Deportes', email: 'deportes@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1002' },
    { name: 'Cristina Manzanares', position: 'Asistente de Deportes', email: 'cmanzanares@clubdelago.com.mx', phone: '81 9689 5727 Ext. 1001' },
  ];

  return (
    <section className="py-24 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-bold tracking-widest text-sm uppercase mb-3 block italic">Transparencia</span>
          <h2 className="text-4xl md:text-5xl text-navy font-serif italic mb-4 leading-tight lowercase first-letter:uppercase">Directorio Administrativo</h2>
          <p className="text-slate-500 italic text-sm">Nuestro equipo de profesionales está a su servicio para garantizar la mejor experiencia en el Club.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staff.map((member, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
              {/* Avatar Placeholder */}
              <div className="w-16 h-16 bg-slate-50 rounded-sm flex items-center justify-center mb-4 border border-slate-100 group-hover:border-gold transition-colors">
                <Users size={24} className="text-slate-400 group-hover:text-gold" />
              </div>
              
              <h4 className="text-navy font-bold uppercase text-xs tracking-wider mb-1 italic">{member.name}</h4>
              <p className="text-gold font-bold text-[10px] uppercase tracking-tighter mb-4 italic leading-tight">{member.position}</p>
              
              <div className="w-full pt-4 border-t border-slate-50 space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 justify-center">
                    <Mail size={12} className="text-slate-400" />
                    <a href={`mailto:${member.email}`} className="text-[9px] text-slate-500 hover:text-navy transition-colors truncate italic font-medium">{member.email}</a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 justify-center">
                    <Phone size={12} className="text-slate-400" />
                    <span className="text-[9px] text-slate-500 font-bold italic tracking-tighter">{member.phone}</span>
                  </div>
                )}
                {member.note && (
                  <div className="mt-3 p-3 bg-navy/5 text-[8px] text-navy italic leading-tight border-l-2 border-gold text-left">
                    {member.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SportsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allSports = [
    'Acuafitnes', 'Baile', 'Dancefit', 'Ritmos Latinos', 'Zumba', 
    'Basquetbol', 'Crosfit', 'Fitness', 'Spinning', 'Pilates', 
    'Frontenis', 'Fútbol', 'Gimnasia', 'Natación', 'Taekwondo', 'Tenis', 'Yoga'
  ];

  return (
    <div className="pt-20 bg-white">
      {/* Sports Hero */}
      <section className="py-20 bg-navy text-white relative overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block italic">Alto Rendimiento</span>
          <h1 className="text-4xl md:text-6xl font-serif italic lowercase first-letter:uppercase mb-6">Pasión que se vive en familia</h1>
          <p className="max-w-2xl mx-auto text-slate-300 italic">Clases diseñadas para todas las edades: niños, jóvenes, adultos y adultos mayores.</p>
        </div>
      </section>

      {/* Flyers Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif italic text-navy">Próximos Torneos & Clases</h2>
              <p className="text-sm text-slate-500 italic mt-2">Consulta los últimos flyers informativos.</p>
            </div>
            <div className="h-px bg-gold/30 grow mx-8 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[3/4] bg-white border border-slate-200 p-2 shadow-sm rounded-sm group cursor-pointer overflow-hidden">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:scale-110 transition-transform">Flyer de Deporte {i}</span>
                   <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                     <p className="text-white text-xs font-bold leading-relaxed italic">Click para ampliar información y horarios</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok / Video Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2">
              <span className="text-gold font-bold uppercase text-xs tracking-widest mb-4 block italic">En Acción</span>
              <h2 className="text-4xl font-serif italic mb-6 leading-tight text-navy">Nuestra comunidad en movimiento</h2>
              <p className="text-slate-600 mb-8 italic">Sigue nuestra energía día a día. Mira clips exclusivos de entrenamientos, eventos y la vida deportiva en nuestras redes sociales.</p>
              <button className="btn-outline flex items-center gap-3">
                Ver TikTok Oficial <ExternalLink size={14} />
              </button>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-2 gap-4">
               {[1, 2].map(i => (
                 <div key={i} className="aspect-[9/16] bg-slate-900 rounded-sm overflow-hidden border-4 border-navy shadow-xl relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                      <ArrowRight size={40} className="rotate-90" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <p className="text-white text-[10px] font-bold uppercase tracking-widest">Video Placeholder {i}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Sports Directory */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center font-serif italic text-3xl text-navy mb-16">Todas nuestras disciplinas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allSports.map(sport => (
              <div key={sport} className="bg-white p-6 border border-slate-100 accent-border-l-gold text-center hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold text-navy uppercase tracking-tighter block">{sport}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Sports />
      <Restaurant />
      <AppBanner />
      <Contact />
    </>
  );
};

const DirectoryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return <Directory />;
};

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-white selection:bg-gold/30 selection:text-navy italic min-h-screen flex flex-col">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deportes" element={<SportsPage />} />
            <Route path="/directorio" element={<DirectoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
