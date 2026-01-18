import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Globe,
  Edit3,
  Save,
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Hammer,
  Swords,
  Flag,
  LogOut,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';

/* ================= ICON MAP ================= */
const IconMap = {
  Shield,
  Hammer,
  Swords,
  Flag
};

/* ================= COMPONENT ================= */
export default function StraLikeRulesSecure() {
  const [lang, setLang] = useState('fr');
  const [data, setData] = useState(null);

  // Admin / sécurité
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState('general');

  /* ================= LOAD DATA FROM SERVER ================= */
  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(serverData => setData(serverData))
      .catch(() => alert("Erreur chargement des règles"));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Chargement...
      </div>
    );
  }

  const content = data[lang];
  const toggleLang = () => setLang(prev => (prev === 'fr' ? 'en' : 'fr'));

  /* ================= LOGIN ADMIN (SERVER) ================= */
  const submitLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput })
    });

    if (res.ok) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  /* ================= SAVE TO SERVER ================= */
  const handleSave = async () => {
    setIsSaving(true);

    await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    setIsSaving(false);
    alert('Sauvegardé côté serveur ✅');
  };

  /* ================= EDIT HANDLERS ================= */
  const updateImportant = (text) => {
    setData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        important: { ...prev[lang].important, content: text }
      }
    }));
  };

  const updateSectionTitle = (sectionIndex, newTitle) => {
    const newSections = [...data[lang].sections];
    newSections[sectionIndex].title = newTitle;

    setData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], sections: newSections }
    }));
  };

  const updateRule = (sectionIndex, ruleIndex, newText) => {
    const newSections = [...data[lang].sections];
    newSections[sectionIndex].rules[ruleIndex] = newText;

    setData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], sections: newSections }
    }));
  };

  const addRule = (sectionIndex) => {
    const newSections = [...data[lang].sections];
    newSections[sectionIndex].rules.push('Nouvelle règle...');

    setData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], sections: newSections }
    }));
  };

  const removeRule = (sectionIndex, ruleIndex) => {
    const newSections = [...data[lang].sections];
    newSections[sectionIndex].rules.splice(ruleIndex, 1);

    setData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], sections: newSections }
    }));
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{content.subtitle}</h1>
              <p className="text-xs text-slate-400 uppercase">{content.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm"
            >
              <Globe size={14} /> {lang.toUpperCase()}
            </button>

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded"
              >
                <Lock size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ADMIN TOOLBAR */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex justify-between">
            <span className="text-indigo-300 font-bold">Mode Admin</span>
            <button
              onClick={handleSave}
              className="bg-green-600 px-4 py-2 rounded text-white flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Sauvegarder
            </button>
          </div>
        )}

        {/* IMPORTANT */}
        <div className="mb-10 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-red-400 font-bold flex gap-2 mb-3">
            <AlertTriangle size={18} />
            {content.important.title}
          </h2>

          {isAdmin ? (
            <textarea
              className="w-full h-40 bg-slate-900 border border-red-500/30 rounded p-3"
              value={content.important.content}
              onChange={(e) => updateImportant(e.target.value)}
            />
          ) : (
            <p className="whitespace-pre-line">{content.important.content}</p>
          )}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <nav className="lg:col-span-3 space-y-2">
            {content.sections.map((section) => {
              const Icon = IconMap[section.icon] || Shield;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                    activeTab === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon size={16} />
                  {section.title}
                </button>
              );
            })}
          </nav>

          <div className="lg:col-span-9">
            {content.sections.map((section, sIndex) =>
              activeTab === section.id && (
                <div key={section.id} className="bg-slate-800 rounded-xl p-6">
                  {isAdmin ? (
                    <input
                      className="w-full bg-slate-900 text-white text-2xl font-bold mb-6 p-2 rounded"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                  )}

                  <div className="space-y-3">
                    {section.rules.map((rule, rIndex) => (
                      <div key={rIndex} className="flex gap-3">
                        <span className="text-blue-400 font-bold">{rIndex + 1}</span>

                        {isAdmin ? (
                          <>
                            <textarea
                              className="flex-1 bg-slate-900 rounded p-2"
                              value={rule}
                              onChange={(e) => updateRule(sIndex, rIndex, e.target.value)}
                            />
                            <button
                              onClick={() => removeRule(sIndex, rIndex)}
                              className="text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <p>{rule}</p>
                        )}
                      </div>
                    ))}

                    {isAdmin && (
                      <button
                        onClick={() => addRule(sIndex)}
                        className="mt-4 w-full border border-dashed border-slate-600 rounded p-3 text-slate-400"
                      >
                        <Plus size={16} /> Ajouter une règle
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-slate-900 p-6 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Admin</h3>

              <form onSubmit={submitLogin} className="space-y-3">
                <input
                  type="password"
                  className="w-full bg-slate-800 p-3 rounded"
                  placeholder="Mot de passe"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />

                {loginError && <p className="text-red-400">{loginError}</p>}

                <button className="w-full bg-blue-600 py-2 rounded text-white">
                  Se connecter
                </button>
              </form>

              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-4 text-slate-400"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
