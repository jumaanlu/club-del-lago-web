import { useState, useEffect, FormEvent } from 'react';
import { 
  Menu, X, ChevronRight, ChevronLeft, Phone, Mail, MapPin, 
  Instagram, Facebook, Clock, Trophy, Users, 
  Dumbbell, Utensils, Calendar, Smartphone,
  ExternalLink, ArrowRight, Loader2, CheckCircle2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  const navLinks = [
    { name: 'Inicio', href: pathname === '/' ? '#inicio' : '/' },
    { name: 'El Club', href: pathname === '/' ? '#club' : '/#club' },
    { name: 'Deportes', href: '/deportes', isPage: true },
    { name: 'Directorio', href: '/directorio', isPage: true },
    { name: 'Restaurante', href: '/restaurante', isPage: true },
    { name: 'Contacto', href: pathname === '/' ? '#contacto' : '/#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy text-white h-20 flex items-center justify-between px-6 md:px-12 border-b-4 border-gold shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-4 group">
          <img src="/images/logo.png" alt="Club del Lago Logo" className="h-14 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight leading-none uppercase group-hover:text-gold transition-colors">Club del Lago</h1>
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
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">La elegancia del deporte en un entorno natural único</h2>
            <p className="text-sm text-slate-200 max-w-md leading-relaxed mb-8 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
              Disfrute de las mejores instalaciones deportivas y sociales de Monterrey. Un espacio diseñado para el bienestar y la integración de toda su familia.
            </p>
            <div className="flex gap-4">
            </div>
          </div>
          
          <img 
            src="/Instalaciones/hero.jpg" 
            alt="Club Layout" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Featured Section */}
        <div className="md:w-2/5 flex flex-col gap-6">
          <div className="bg-navy p-8 text-white flex-grow relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-gold font-bold uppercase text-xs tracking-widest mb-4 italic">Excelencia desde 1981</h3>
              <h4 className="text-3xl font-serif italic mb-4">Vida Social y Convivencia</h4>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed italic">
                Descubra el equilibrio perfecto entre deporte, convivencia y momentos inolvidables en un ambiente familiar de primer nivel.
              </p>
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
                  <span className="block text-lg font-bold text-navy leading-none">07</span>
                  <span className="text-[9px] uppercase text-slate-400">Mayo</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Día de las Madres - Celebración Especial.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center shrink-0">
                  <span className="block text-lg font-bold text-navy leading-none">11</span>
                  <span className="text-[9px] uppercase text-slate-400">Mayo</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Asamblea General Ordinaria.</p>
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
                src="/Instalaciones/club5.jpg" 
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
    { title: 'Tenis', desc: '12 canchas profesionales con iluminación de última generación.', border: 'accent-border-l-forest' },
    { title: 'Natación', desc: 'Alberca techada, olímpica y climatizada para entrenamiento y recreación.', border: 'accent-border-l-gold' },
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
                <p className="text-sm font-semibold uppercase tracking-wide text-navy">Restaurante Las Palmas</p>
                <p className="text-xs text-slate-500 italic">Elegancia y tradición en cada platillo. Ideal para desayunos y comidas familiares.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1 bg-gold h-full self-stretch"></div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-navy">Snack Brasas</p>
                <p className="text-xs text-slate-500 italic">Deliciosos cortes y snacks en un ambiente relajado junto a las brasas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1 bg-gold h-full self-stretch"></div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-navy">Bar Terraza</p>
                <p className="text-xs text-slate-500 italic">Coctelería premium y botanas con la mejor vista panorámica del club.</p>
              </div>
            </div>
          </div>

          <Link to="/restaurante" className="btn-primary inline-block">Ver Áreas y Menús</Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 h-full"
        >
          <div className="space-y-4">
            <img src="/Instalaciones/brasas.jpg" className="rounded-sm h-64 w-full object-cover border border-slate-100" alt="Snack Brasas" />
            <div className="bg-forest/10 p-6 flex items-center justify-center border-l-4 border-forest">
               <span className="text-forest font-bold uppercase text-[10px] tracking-widest text-center">Insumos de <br/> Primera Calidad</span>
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <img src="/Instalaciones/Palmas-1.jpg" className="rounded-sm h-44 w-full object-cover border border-slate-100" alt="Restaurante" />
            <img src="/Instalaciones/bar.jpg" className="rounded-sm h-64 w-full object-cover border border-slate-100" alt="Bar Terraza" />
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
              <a 
                href="https://apps.apple.com/mx/app/delagoapp/id6443742007" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-navy px-8 py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-gold hover:text-white transition-all inline-block"
              >
                Download App Store
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=clubs.zerotwo.com.delagoapp&pcampaignid=web_share" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-navy transition-all inline-block"
              >
                Download Google Play
              </a>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <div className="w-64 h-[500px] bg-slate-800 rounded-[2rem] border-8 border-navy shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-navy rounded-b-xl z-20" />
               <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center relative z-10">
                  <img src="/images/logo.png" alt="DelagoApp Logo" className="w-24 h-auto object-contain mb-8 filter brightness-110" />
                  <h4 className="text-white font-bold uppercase tracking-widest text-lg">Club del Lago</h4>
                  <p className="text-gold text-[10px] uppercase font-bold mt-2 tracking-[0.3em]">Mobile Portal</p>
               </div>
               {/* Decorative App Background */}
               <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" />
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
    
    const path = 'contacts';
    try {
      // 1. Guardar en Firestore para respaldo
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // 2. Enviar correo a través del servidor
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          mensaje: formData.message
        })
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('error');
      handleFirestoreError(error, OperationType.WRITE, path);
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
          <div className="flex items-center gap-4">
             <img src="/images/logo.png" alt="Club del Lago" className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
             <span className="font-display font-bold text-navy text-sm uppercase tracking-widest">Club del Lago</span>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredFlyers = [
    'CROSSFIT.png',
    'NATACION MIXTO ADULTOS.png',
    'ZUMBA FITNESS.png',
    'ACONDICIONAMIENTO FISICO.png'
  ];

  // Auto-play for featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredFlyers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredFlyers.length]);

  const categories = [
    { name: 'Fitness & Salud', keywords: ['ACONDICIONAMIENTO', 'PILATES', 'YOGA', 'CROSSFIT', 'FITNESS', 'SPINNING', 'DAMAS'] },
    { name: 'Academia de Tenis', keywords: ['TENIS', 'FRONTENIS', 'BOLA'] },
    { name: 'Escuela de Fútbol', keywords: ['FUTBOL'] },
    { name: 'Deportes Acuáticos', keywords: ['NATACION', 'NATACIÓN', 'ACUAFITNESS', 'AQUAFITNESS'] },
    { name: 'Baile & Ritmo', keywords: ['BAILE', 'ZUMBA', 'RITMOS', 'DANCE'] },
    { name: 'Artes & Gimnasia', keywords: ['GIMNASIA', 'TAEKWONDO', 'TELAS'] },
    { name: 'Básquetbol', keywords: ['BASQUETBOL'] },
  ];

  const allFlyersData = [
    'ACONDICIONAMIENTO FISICO.png',
    'ACUAFITNESS 7AM.png',
    'ADULTOS FUTBOL.png',
    'AQUAFITNESS CLASE AM.png',
    'AQUAFITNESS CLASE PM.png',
    'BASQUETBOL.png',
    'CLASE DE BAILE.png',
    'CROSSFIT.png',
    'DANCE FIT.png',
    'FITNESS DAMAS.png',
    'FRONTENIS.png',
    'FUTBOL MIXTO INFANTIL 2011-2014.png',
    'FUTBOL MIXTO INFANTIL 2015-2019.png',
    'FUTBOL MIXTO INFANTIL 2020-2022.png',
    'GIMNASIA ARTISTICA.png',
    'NATACION MIXTO ADULTOS.png',
    'NATACIÓN MIXTO INFANTIL.png',
    'PILATES.png',
    'RITMOS LATINOS.png',
    'SPINNING CLASS.png',
    'TAEKWONDO.png',
    'TELAS.png',
    'TENIS BOLA AMARILLA EQUIPO.png',
    'TENIS BOLA AMARILLA PRE EQUIPO.png',
    'TENIS BOLA NARANJA.png',
    'TENIS BOLA ROJA.png',
    'TENIS BOLA VERDE JR AVANZADO.png',
    'TENIS BOLA VERDE.png',
    'YOGA.png',
    'ZUMBA CLASS.png',
    'ZUMBA FITNESS.png'
  ];

  const allSports = [
    'Acuafitnes', 'Baile', 'Dancefit', 'Ritmos Latinos', 'Zumba', 
    'Basquetbol', 'Crosfit', 'Fitness', 'Spinning', 'Pilates', 
    'Frontenis', 'Fútbol', 'Gimnasia', 'Natación', 'Taekwondo', 'Tenis', 'Yoga'
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  const filteredFlyers = allFlyersData.filter(flyer => {
    const fileName = flyer.toUpperCase();
    const matchesSearch = searchQuery ? fileName.includes(searchQuery.toUpperCase()) : true;
    const category = categories.find(c => c.name === activeCategory);
    return matchesSearch && (category?.keywords.some(k => fileName.includes(k)) ?? false);
  });

  const scrollContainer = (direction: 'left' | 'right') => {
    const el = document.getElementById('academy-scroll-container');
    if (el) {
      const scrollAmount = 350;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-20 bg-white">
      {/* Sports Hero */}
      <section className="bg-navy py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-4 rotate-12 scale-150">
            {allSports.map((s, i) => (
              <span key={i} className="text-white text-4lg font-serif italic whitespace-nowrap lowercase">{s}</span>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block"
          >
            Club del Lago
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif italic text-white mb-2"
          >
            Cartelera Deportiva
          </motion.h1>
          <p className="text-slate-400 text-xs italic">Explora nuestras disciplinas y horarios.</p>
        </div>
      </section>

      {/* Featured Highlight Slider */}
      <section className="py-12 bg-white relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-[400px] md:h-[500px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeaturedIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col md:flex-row gap-12 items-center"
                >
                  <div className="w-full md:w-1/2 h-full relative">
                    <div className="w-full h-full bg-white border border-slate-100 p-2 rounded-sm shadow-xl overflow-hidden">
                      <img 
                        src={encodeURI(`/images/flyers/${featuredFlyers[currentFeaturedIndex]}`)} 
                        alt="Featured" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/f8fafc/1e293b?text=Flyer';
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 text-left">
                    <span className="bg-navy text-white text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 mb-6 inline-block">Destacado</span>
                    <h4 className="text-4xl md:text-5xl font-serif italic text-navy mb-4 leading-tight lowercase first-letter:uppercase">
                      {featuredFlyers[currentFeaturedIndex].replace('.png', '')}
                    </h4>
                    <p className="text-slate-500 text-base italic leading-relaxed max-w-sm">
                      Únete a nuestras sesiones de alta intensidad y vive el deporte como nunca antes.
                    </p>
                  </div>
                </motion.div>
             </AnimatePresence>

             <div className="absolute bottom-0 right-0 flex gap-4 pr-6 pb-6">
                <button 
                  onClick={() => setCurrentFeaturedIndex((prev) => (prev - 1 + featuredFlyers.length) % featuredFlyers.length)}
                  className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all shadow-md z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentFeaturedIndex((prev) => (prev + 1) % featuredFlyers.length)}
                  className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all shadow-md z-10"
                >
                  <ChevronRight size={20} />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative max-w-md mx-auto group">
            <input 
              type="text" 
              placeholder="¿Qué actividad busca hoy?" 
              className="w-full bg-white border border-slate-200 rounded-full py-4 px-12 text-sm italic focus:border-gold outline-none transition-all shadow-sm focus:shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Smartphone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FILTERED ACADEMY VIEW */}
      <section className="bg-slate-50 py-16" id="cartelera">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-serif italic text-navy uppercase tracking-tighter">Nuestras Academias</h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm border ${
                      activeCategory === cat.name 
                        ? 'bg-navy text-white border-navy shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group w-full lg:w-64">
              <input 
                type="text" 
                placeholder="Buscar rapidez..." 
                className="w-full bg-white border border-slate-200 rounded-sm py-3 px-10 text-xs italic focus:border-gold outline-none transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm p-6 md:p-10 relative">
            {/* Visual cues for scrolling */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">{activeCategory}</span>
                <div className="h-px bg-slate-100 flex-grow w-24"></div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => scrollContainer('left')}
                  className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-navy hover:text-white transition-all text-navy shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scrollContainer('right')}
                  className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-navy hover:text-white transition-all text-navy shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div 
              id="academy-scroll-container"
              className="flex gap-6 overflow-x-auto pb-10 snap-x no-scrollbar scroll-smooth"
            >
              {filteredFlyers.length > 0 ? (
                filteredFlyers.map((flyer, idx) => (
                  <motion.div 
                    key={flyer}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer"
                  >
                    <div className="aspect-[3/4] overflow-hidden border border-slate-100 bg-slate-50 relative p-2">
                      <img 
                        src={encodeURI(`/images/flyers/${flyer}`)} 
                        alt={flyer} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]">
                         <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center mb-3">
                            <Plus className="text-navy" size={20} />
                         </div>
                         <p className="text-white text-[10px] font-black tracking-widest uppercase italic">Ver Detalles</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-black text-navy uppercase tracking-widest truncate">{flyer.replace('.png', '')}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="w-full py-16 text-center bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-slate-400 italic text-sm">No hay resultados para esta búsqueda o academia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TikTok / Video Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-gold font-bold uppercase text-[10px] tracking-[0.4em] mb-4 block italic">En Acción</span>
              <h2 className="text-4xl font-serif italic leading-tight text-navy">Nuestra comunidad en movimiento</h2>
              <p className="text-slate-500 mt-4 italic text-sm">Sigue nuestra energía día a día. Mira clips exclusivos de entrenamientos y eventos en nuestras redes sociales.</p>
            </div>
            <a 
              href="https://www.tiktok.com/@clubdelagomty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-navy text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-colors flex items-center gap-3 rounded-sm shadow-lg"
            >
              Ver TikTok Oficial <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar snap-x">
             {[
               '7607975878366104839',
               '7609057084826586376',
               '7610509442747993362',
               '7611610086909250824',
               '7630927951055441159'
             ].map((id, idx) => (
               <motion.div 
                 key={id} 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="min-w-[280px] md:min-w-[320px] aspect-[9/16] bg-black rounded-sm overflow-hidden border border-slate-100 shadow-xl snap-start relative group"
               >
                 <iframe
                   src={`https://www.tiktok.com/embed/v2/${id}`}
                   className="w-full h-full border-0"
                   allow="fullscreen; encrypted-media; picture-in-picture"
                   title={`TikTok video ${idx + 1}`}
                 />
               </motion.div>
             ))}
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

const RestaurantPage = () => {
  const [showDetailedMenu, setShowDetailedMenu] = useState(false);
  const [menuType, setMenuType] = useState('comidas'); // 'desayunos', 'comidas', or 'terraza'
  const [activeCategory, setActiveCategory] = useState('Principales');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const comidasData = [
    {
      category: 'Principales',
      items: [
        { name: 'Comida del día', price: '$150', desc: 'Menú completo: Entrada, plato fuerte con dos guarniciones y agua de refil.' },
        { name: 'Milanesa de pollo', price: '$105', desc: 'Empanizada o a la plancha, acompañada de dos guarniciones a elegir.' },
        { name: 'Milanesa de res', price: '$120', desc: 'Empanizada, acompañada de dos guarniciones a elegir.' },
        { name: 'Filete de pescado', price: '$110', desc: 'Empanizado o a la plancha, acompañado de dos guarniciones a elegir.' },
        { name: 'Club Sándwich', price: '$95', desc: 'Sándwich clásico con pollo, aguacate, lechuga, tomate, cebolla y mayonesa.' },
        { name: 'Hamburguesa del Lago', price: '$115', desc: 'Carne de res, lechuga, tomate, aguacate, queso amarillo y jamón.' },
        { name: 'Hamburguesa de pollo', price: '$115', desc: 'Pechuga de pollo empanizada o a la plancha, lechuga, tomate y aguacate.' },
        { name: 'Tacos de bistec', price: '$110', desc: 'Orden de cinco tacos de bistec y cebollita guisada.' },
        { name: 'Enchiladas suizas', price: '$105', desc: 'Cinco enchiladas en salsa verde rellenas de pollo y gratinadas.' },
        { name: 'Entomatadas', price: '$105', desc: 'Cinco entomatadas en salsa roja, rellenas de queso panela.' },
        { name: 'Chile Huasteco', price: '$159', desc: 'Chile poblano natural, relleno de salpicón de camarones a la crema de chipotle.' },
        { name: 'Tampiqueña', price: '$180', desc: 'Carne de res con frijoles, guacamole, enchiladas suizas y nopal asado.' },
        { name: 'Ensalada César', price: '$90', desc: 'Lechuga, tomate, queso parmesano, crotones y aderezo césar.' },
        { name: 'Ensalada Capri', price: '$115', desc: 'Lechuga, nuez, tomate, cebolla morada, cherry, panela y fresas.' },
        { name: 'Tostadas de pollo', price: '$98', desc: 'Crujientes tostadas de maíz con pollo, lechuga, tomate, crema y queso. (1 pza $35)' },
        { name: 'Pirata', price: '$38 / $96', desc: 'Tortilla de harina con queso manchego y carne de res. (Mini $38 / Gde. $96)' },
        { name: 'Rib eye (300g)', price: '$330', desc: 'Corte de rib eye con papas a la sal, cebolla y chile toreado.' },
      ]
    },
    {
      category: 'Pastas & Sopas',
      items: [
        { name: 'Mamma Rossa', price: '$86', desc: 'Fettuccine en salsa cremosa de tomate, albahaca y parmesano.' },
        { name: 'Bianca', price: '$86', desc: 'Fettuccine en salsa blanca de quesos y vino blanco.' },
        { name: 'Sopa o Crema del día', price: '$49', desc: 'Entrada de la comida del día, sujeto a disponibilidad.' },
        { name: 'Caldo Tlalpeño', price: '$55 / $145', desc: 'Pollo desmenuzado, arroz, vegetales y chipotle. (Ch. $55 / Gde. $145)' },
        { name: 'Crema Napolitana', price: '$80', desc: 'Delicada crema de tomate con finas hierbas y mini emparedado.' },
      ]
    },
    {
      category: 'Extras & Complementos',
      items: [
        { name: 'Quesadilla', price: '$16', desc: '1 pieza en tortilla de harina o maíz con queso manchego.' },
        { name: 'Sincronizada', price: '$35', desc: 'En harina o maíz, con jamón y queso manchego.' },
        { name: 'Guacamole', price: '$85', desc: 'Guacamole natural, acompañado de totopos y pico de gallo.' },
        { name: 'Papas fritas', price: '$66', desc: 'Orden de papas a la francesa clásicas.' },
        { name: 'Queso fundido', price: '$85 / $100', desc: '150g de queso fundido. (Natural $85 / Con Chorizo $100)' },
        { name: 'Abanico de aguacate', price: '$30', desc: '50g de aguacate fresco de temporada.' },
        { name: 'Guarnición extra', price: '$35', desc: 'Arroz, frijoles, ensalada o papas a la francesa.' },
        { name: 'Ingrediente extra A', price: '$20', desc: 'Espinaca, yogur, granola, pan tostado o champiñones.' },
        { name: 'Ingrediente extra B', price: '$30', desc: 'Pollo, tocino, queso, nopal, carne de res o chorizo.' },
        { name: 'Huevo (1 pza)', price: '$15', desc: 'Preparado al gusto como ingrediente extra.' },
        { name: 'Chiles toreados', price: '$10', desc: 'Orden de 3 piezas de chiles toreados.' },
        { name: 'Pan de ajo', price: '$18', desc: 'Pan de ajo de la casa recién horneado.' },
        { name: 'Verduras al vapor', price: '$40', desc: 'Mezcla de vegetales frescos al vapor.' },
        { name: 'Nutella', price: '$25', desc: 'Porción extra de nutella cremosa.' },
      ]
    },
    {
      category: 'Infantil',
      items: [
        { name: 'Hamburguesa Jr.', price: '$78', desc: 'Tradicional de res con jamón, queso y papas a la francesa.' },
        { name: 'Chicken Strips', price: '$70', desc: 'Tiras de pechuga de pollo empanizadas con papas.' },
        { name: 'Dedos de queso', price: '$98', desc: '5 dedos de queso manchego y papas a la francesa.' },
        { name: 'Hot dog Infantil', price: '$40', desc: 'Clásico hot dog con pan de la casa y papas.' },
      ]
    },
    {
      category: 'Postres',
      items: [
        { name: 'Bisquet Especial', price: '$32', desc: 'Bisquet de la casa tostado con mantequilla.' },
        { name: 'Pan dulce del día', price: '$12', desc: 'Selección de panadería artesanal recién horneada.' },
        { name: 'Cheesecake / Flan', price: '$58', desc: 'Nuestra selección de repostería artesanal del día.' },
        { name: 'Empanada dulce', price: '$15', desc: 'Rellena de cajeta o piña.' },
      ]
    }
  ];

  const desayunosData = [
    {
      category: 'Fruta & Hot Cakes',
      items: [
        { name: 'Plato de fruta', price: '$48 / $78', desc: 'Fruta de temporada con yogur natural y granola. (Ch. $48 / Gde. $78)' },
        { name: 'Hot Cakes Gluten Free', price: '$77', desc: '3 piezas elaborados con avena natural, plátano, huevo y toque de canela.' },
        { name: 'Hot Cakes Americanos', price: '$90', desc: '3 esponjosos hot cakes tradicionales con mantequilla y mermelada. (1 pza $35)' },
      ]
    },
    {
      category: 'Huevos & Especialidades',
      items: [
        { name: 'Huevo al gusto', price: '$85', desc: 'Dos piezas con un ingrediente a elegir: jamón, champiñones, chorizo, etc. (Med. Ord. $48)' },
        { name: 'Omelette al gusto', price: '$100', desc: 'Dos huevos con queso manchego y un ingrediente a elegir.' },
        { name: 'Omelette Fit', price: '$90', desc: 'Solo claras con espinacas y queso panela sobre cama de nopal y aguacate.' },
        { name: 'Machacado', price: '$105', desc: 'Natural o a la mexicana con frijoles. (Med. Ord. $58)' },
        { name: 'Huevos Campiranos', price: '$125', desc: 'Asiento de frijol, 2 huevos montados con chicharrón en salsa verde.' },
        { name: 'Huevos Delago', price: '$90', desc: 'Sobre sincronizada de maíz bañados en salsa roja y frijoles.' },
        { name: 'Tacos Mineros', price: '$90', desc: 'Tres tacos de huevo a la mexicana bañados con crema conde y chorizo.' },
        { name: 'Ranch Toast', price: '$98', desc: 'Tostada de pan de la casa, frijoles, guacamole, queso panela y 2 huevos.' },
      ]
    },
    {
      category: 'Antojitos',
      items: [
        { name: 'Chilaquiles', price: '$90', desc: 'Rojos o verdes con queso, crema y frijoles. (Pollo +$30 / Huevo +$15 / Carne +$35)' },
        { name: 'Machil', price: '$118', desc: 'Chilaquiles con pollo o huevo, rojos o verdes y machacado.' },
        { name: 'Enchiladas Suizas', price: '$105', desc: 'Cinco enchiladas en salsa verde rellenas de pollo y gratinadas.' },
        { name: 'Mollete Tradicional', price: '$60', desc: 'Pan francés con frijoles y queso gratinado con pico de gallo.' },
        { name: 'Molletes Lago', price: '$95', desc: 'Pan francés con frijoles, queso y un guiso: chicharrón, picadillo, etc.' },
        { name: 'Tostadas de pollo', price: '$98', desc: '3 crujientes tostadas con frijoles, pollo deshebrado y aguacate.' },
        { name: 'Queso a la plancha', price: '$70', desc: 'Queso panela a la plancha con aguacate y pico de gallo.' },
        { name: 'Queso en salsa', price: '$80', desc: 'Panela guisado con salsa roja o verde y frijoles.' },
      ]
    },
    {
      category: 'Tacos & Gorditas',
      items: [
        { name: 'Taco de guiso', price: '$19', desc: 'En harina o maíz con guiso a elección.' },
        { name: 'Gordita de guiso', price: '$25', desc: 'Gordita rellena de guiso a elección.' },
        { name: 'Quesadilla', price: '$12', desc: 'Tortilla de harina o maíz con queso manchego.' },
        { name: 'Sincronizada', price: '$27', desc: 'Harina o maíz con jamón y queso manchego.' },
      ]
    },
    {
      category: 'Solo Domingos',
      items: [
        { name: 'Taco de barbacoa', price: '$23', desc: 'Especialidad en Maíz o harina.' },
        { name: 'Gordita de barbacoa', price: '$28', desc: 'Especialidad en Maíz o harina.' },
        { name: 'Barbacoa por Kilo', price: '$450', desc: 'Incluye tortillas, cilantro, cebolla y salsa. (Medio Kilo $225)' },
        { name: 'Menudo del Día', price: '$100', desc: 'Delicioso menudo tradicional servido caliente.' },
      ]
    },
    {
      category: 'Postres',
      items: [
        { name: 'Bisquet Especial', price: '$32', desc: 'Bisquet de la casa tostado con mantequilla.' },
        { name: 'Pan dulce del día', price: '$12', desc: 'Selección de panadería artesanal recién horneada.' },
        { name: 'Cheesecake / Flan', price: '$58', desc: 'Nuestra selección de repostería artesanal del día.' },
        { name: 'Empanada dulce', price: '$15', desc: 'Rellena de cajeta o piña.' },
      ]
    }
  ];

  const terrazaData = [
    {
      category: 'Entradas & Botanas',
      items: [
        { name: 'Hierro de papas', price: '$85', desc: 'Papas cambray bañadas en salsa brava o salsa lagarto de aguacate.' },
        { name: 'Guacamole natural', price: '$85', desc: '160g de guacamole fresco de la casa.' },
        { name: 'Guacamole Ranchero', price: '$115', desc: 'Con diezmillo y chicharrón a la mexicana en salsa verde.' },
        { name: 'Guacamole Ramos', price: '$115', desc: 'Con el tradicional chicharrón de la Ramos.' },
        { name: 'Guacamole Mamucas', price: '$127', desc: 'Aguacate, cebolla morada, tomate cherry, queso panela y aceite de oliva.' },
        { name: 'Queso fundido', price: '$85 - $115', desc: 'Natural ($85), Chorizo ($100), Champiñones ($110) o Camarones ($115).' },
        { name: 'Frijoles con veneno', price: '$89', desc: 'Frijoles refritos con asado de boda.' },
        { name: 'Cazuela Norestense', price: '$105', desc: 'Asado de boda, alambre de res o cortadillo norteño.' },
        { name: 'Panela a la plancha', price: '$95', desc: '200g con pico de gallo. (+Guacamole $130 / +Champiñones $120)' },
        { name: 'Kekas', price: '$93', desc: '3 sincronizadas de harina con queso manchego, tocino y guacamole.' },
        { name: 'Coliflor Macha', price: '$99', desc: 'Coliflor completa con aderezo de salsa macha y cacahuate.' },
      ]
    },
    {
      category: 'Tacos & Tostadas',
      items: [
        { name: 'Taco Robbin', price: '$30', desc: 'Maíz con costra de queso y jalapeño relleno de quesos con tocino.' },
        { name: 'Taco de Chicharrón de pescado', price: '$50', desc: '2 piezas con costra de queso, aderezo golf y chicharrón de pescado.' },
        { name: 'Taco de Rib Eye', price: '$75', desc: '2 piezas con costra de queso manchego o aguacate y rib eye.' },
        { name: 'Taco de Gobernador', price: '$69', desc: '2 piezas con costra de queso y camarones a la mexicana.' },
        { name: 'Lorenza de Rib Eye', price: '$109', desc: 'Tostada con frijoles, guacamole, rib eye y queso manchego.' },
        { name: 'Pirata', price: '$38 / $96', desc: 'Mini ($38) o Grande ($96) con queso manchego, res y aguacate.' },
        { name: 'Tacos de Bistec', price: '$110', desc: 'Orden de cinco tacos en tortilla de maíz con cebollita.' },
      ]
    },
    {
      category: 'Principales',
      items: [
        { name: 'Pollo al mezcal', price: '$150', desc: 'Salsa naranja y guajillo flameada con mezcal y papas al ajo-romero.' },
        { name: 'Ensalada Maximina', price: '$139', desc: 'Mix de lechuga, fresas, blueberries, coco, pollo y aderezo cilantro.' },
        { name: 'Hamburguesa Rib eye', price: '$145', desc: '200g de carne, cebolla caramelizada, tocino y papas francesas.' },
        { name: 'Chamorro Cantinero', price: '$189', desc: 'Cerdo al horno adobado, con encurtido de cebollas y manzana.' },
        { name: 'Rib eye (300g)', price: '$330', desc: 'Corte de Rib eye con papas a la sal, cebolla y chile toreado.' },
        { name: 'Ensalada César con pollo', price: '$120', desc: 'Lechuga, cherry, parmesano, crotones y pollo a la plancha.' },
      ]
    },
    {
      category: 'Extras',
      items: [
        { name: 'Abanico de aguacate (50g)', price: '$30', desc: 'Aguacate fresco de temporada.' },
        { name: 'Ingrediente extra A', price: '$20', desc: 'Champiñones, aderezo golf, aderezo de cilantro, aderezo césar o crotones.' },
        { name: 'Ingrediente extra B', price: '$30', desc: 'Tocino, queso manchego, queso panela, crema, carne de res o chorizo.' },
        { name: 'Chiles toreados (3 pzas)', price: '$10', desc: 'Orden de chiles toreados.' },
      ]
    },
    {
      category: 'Postres',
      items: [
        { name: 'Quesaglorias', price: '$48', desc: '2 sincronizadas con coco, bañadas en salsa de Gloria y nuez.' },
        { name: 'Cheesecake / Flan', price: '$58', desc: 'Nuestra selección de repostería artesanal del día.' },
      ]
    }
  ];

  const getMenuData = () => {
    switch (menuType) {
      case 'desayunos': return desayunosData;
      case 'terraza': return terrazaData;
      default: return comidasData;
    }
  };

  const currentMenu = getMenuData();

  const areas = [
    {
      id: 'las-palmas',
      title: 'Restaurante Las Palmas',
      description: 'Nuestra área insignia donde la elegancia y la tradición se encuentran. Disfrute de una experiencia completa en un ambiente refinado.',
      image: '/Instalaciones/Palmas.jpg',
      menus: [
        { label: 'Menú de Desayunos', type: 'digital', file: null, action: () => { setMenuType('desayunos'); setActiveCategory('Fruta & Hot Cakes'); setShowDetailedMenu(true); } },
        { label: 'Menú de Comidas', type: 'digital', file: null, action: () => { setMenuType('comidas'); setActiveCategory('Principales'); setShowDetailedMenu(true); } }
      ]
    },
    {
      id: 'snack-brasas',
      title: 'Snack Brasas',
      description: 'El lugar ideal para una comida informal. Especialidad en cortes y opciones rápidas para disfrutar en un ambiente relajado.',
      image: '/Instalaciones/brasas.jpg',
      menus: [
        { label: 'Ver Menú Snack', type: 'pdf', file: '/menus/menu-snack-brasas.pdf', action: null }
      ]
    },
    {
      id: 'bar-terraza',
      title: 'Bar Terraza',
      description: 'Relájese con la mejor vista del club. Disfrute de nuestra coctelería premium y botanas artesanales al atardecer.',
      image: '/Instalaciones/bar.jpg',
      menus: [
        { label: 'Ver Menú Digital', type: 'digital', file: null, action: () => { setMenuType('terraza'); setActiveCategory('Entradas & Botanas'); setShowDetailedMenu(true); } }
      ]
    }
  ];

  if (showDetailedMenu) {
    return (
      <div className="pt-20 bg-white min-h-screen">
        <div className="bg-navy py-8 px-6 border-b border-gold">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => setShowDetailedMenu(false)}
              className="text-white font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-gold transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" /> Volver a Áreas
            </button>
            <h2 className="text-white font-serif italic text-xl uppercase tracking-tighter">
              {menuType === 'desayunos' ? 'Menú Desayunos' : menuType === 'terraza' ? 'Menú Bar Terraza' : 'Menú Comidas'}
            </h2>
            <div className="w-10" /> 
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-6 flex justify-center min-w-max">
            {currentMenu.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeCategory === cat.category ? 'text-navy' : 'text-slate-400 hover:text-navy'
                }`}
              >
                {cat.category}
                {activeCategory === cat.category && (
                  <motion.div layoutId="activeCatTab" className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
                )}
              </button>
            ))}
          </div>
        </div>

        <section className="py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${menuType}-${activeCategory}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-8"
              >
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {currentMenu.find(c => c.category === activeCategory)?.items.map((item, idx) => (
                    <div key={idx} className="group border-b border-slate-200 pb-4">
                      <div className="flex justify-between items-end mb-1">
                        <h3 className="text-navy font-bold text-[11px] uppercase tracking-wider group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-navy font-serif italic">{item.price}</span>
                      </div>
                      {item.desc && (
                        <p className="text-slate-500 text-[10px] italic leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-16 pt-8 border-t border-slate-200 text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest italic">Precios en moneda nacional. Incluyen IVA.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      {/* Hero */}
      <section className="py-24 bg-navy text-white relative overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550966842-282412830225?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block italic">Experiencia Gastronómica</span>
            <h1 className="text-4xl md:text-6xl font-serif italic lowercase first-letter:uppercase mb-6">Sabores que definen nuestra tradición</h1>
            <p className="text-slate-300 italic text-lg leading-relaxed">
               Distintas áreas diseñadas para cada momento del día. Desde desayunos familiares hasta cenas exclusivas.
            </p>
          </div>
        </div>
      </section>

      {/* Areas List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-32">
            {areas.map((area, idx) => (
              <motion.div 
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
              >
                <div className="lg:w-1/2 w-full">
                  <div className="aspect-[16/10] overflow-hidden border border-slate-100 p-2 bg-white shadow-sm relative group">
                    <img src={area.image} alt={area.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                </div>

                <div className="lg:w-1/2 w-full space-y-8">
                  <div>
                    <span className="text-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-4 block italic">Área {idx + 1}</span>
                    <h2 className="text-3xl md:text-5xl text-navy font-serif italic mb-6 leading-tight">{area.title}</h2>
                    <p className="text-slate-600 italic leading-relaxed text-lg">{area.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {area.menus.map((menu, mIdx) => (
                      <button 
                        key={mIdx}
                        onClick={() => {
                          if (menu.type === 'digital' && menu.action) {
                            menu.action();
                          } else if (menu.type === 'pdf') {
                            window.open(menu.file, '_blank');
                          }
                        }}
                        className="flex items-center gap-3 bg-navy text-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors border-l-4 border-gold shadow-sm"
                      >
                        <Utensils size={14} className="text-gold" />
                        {menu.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Consulte horarios de servicio en recepción</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-serif italic text-navy mb-6">¿Desea reservar una mesa?</h3>
          <p className="text-slate-600 italic mb-10 leading-relaxed">Nuestro equipo está listo para brindarle la mejor experiencia gastronómica. Para reservaciones o eventos especiales, contáctenos vía WhatsApp o teléfono.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:8196895727" className="flex items-center gap-3 text-navy font-bold uppercase text-xs tracking-widest border-b border-gold pb-1 hover:text-gold transition-colors">
              <Phone size={14} /> 81 9689 5727
            </a>
            <a href="https://wa.me/528134028407" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-navy text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors rounded-sm shadow-md">
               <Smartphone size={14} /> WhatsApp Restaurante
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

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

// --- Maintenance ---

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=2515&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-navy/80" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl relative z-10"
      >
        <div className="mb-12">
          <img src="/images/logo.png" alt="Club del Lago" className="h-24 w-auto object-contain mx-auto mb-6" />
          <h2 className="text-gold text-4xl md:text-5xl font-serif italic mb-2">Club del Lago</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>
        
        <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block italic">Experiencia Digital en Renovación</span>
        
        <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-8 leading-tight lowercase first-letter:uppercase">
          Estamos preparando algo especial para usted
        </h1>
        
        <p className="text-slate-400 italic text-lg leading-relaxed mb-16 px-4">
          Nuestro sitio web está en proceso de actualización para brindarle una mejor experiencia y acceso a todos nuestros servicios, menús y novedades.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/70 border-t border-white/10 pt-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Phone size={18} className="text-gold" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contacto Directo</span>
            <span className="text-sm tracking-widest font-medium text-white">81 9689 5727</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Mail size={18} className="text-gold" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Atención a Socios</span>
            <span className="text-sm tracking-widest font-medium text-white lowercase">info@clubdelago.com.mx</span>
          </div>
        </div>
        
        <div className="mt-20">
           <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">Nos vemos pronto</span>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

const IS_MAINTENANCE = false;

export default function App() {
  if (IS_MAINTENANCE) {
    return (
      <MaintenanceMode />
    );
  }

  return (
    <BrowserRouter>
      <div className="bg-white selection:bg-gold/30 selection:text-navy italic min-h-screen flex flex-col">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deportes" element={<SportsPage />} />
            <Route path="/directorio" element={<DirectoryPage />} />
            <Route path="/restaurante" element={<RestaurantPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
