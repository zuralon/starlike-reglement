import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Shield,
  Globe,
  Lock,
  LogOut,
  Save,
  AlertTriangle,
  Hammer,
  Swords,
  Flag,
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
  Youtube,
  Twitch,
  MessageCircle,
  Boxes,
  ThumbsUp
} from "lucide-react";

/* ================= ICON MAP ================= */
const IconMap = {
  Shield,
  Hammer,
  Swords,
  Flag
};

function StaffSection({ staff, lang }) {
  const roles = {
    "76561199089712499": {
      fr: "Fondateur",
      en: "Founder"
    },
    "76561198353848309": {
      fr: "Co‑Fondateur",
      en: "Co‑Founder"
    }
  };

  return (
    <div className="mt-10 bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
      <h3 className="font-bold mb-6 text-slate-300 flex items-center gap-2">
        <Shield size={18} />
        {lang === "fr" ? "Haut Staff" : "Top Staff"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {staff.map((member) => (
          <div
            key={member.steamid}
            className="flex items-center gap-4 bg-slate-800 rounded-xl p-4"
          >
            <img
              src={member.avatarfull}
              alt={member.personaname}
              className="w-16 h-16 rounded-full border border-slate-600"
            />

            <div>
              <p className="font-bold text-lg">
                {member.personaname}
              </p>
              <p className="text-sm text-blue-400 font-semibold">
                {roles[member.steamid]?.[lang]}
              </p>
              <p className="text-xs text-slate-400">
                SteamID: {member.steamid}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("fr");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [staff, setStaff] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ================= LOAD RULES ================= */
  useEffect(() => {
    fetch("/api/rules")
    .then((res) => res.json())
    .then((d) => {
      setData(d);
      setActiveTab(d.fr.sections[0].id);
    });
  }, []);

  useEffect(() => {
  fetch("/api/staff")
    .then(res => res.json())
    .then(setStaff)
    .catch(() => setStaff([]));
}, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      Chargement...
      </div>
    );
  }

  const content = data[lang];
  const sectionIndex = content.sections.findIndex(
    (s) => s.id === activeTab
  );
  const activeSection = content.sections[sectionIndex];

  /* ================= LOGIN ================= */
  const submitLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
  method: "POST",
  headers: {
    "x-admin-password": password
  }
});

    if (res.ok) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Mot de passe incorrect");
    }
  };

  /* ================= ADD / REMOVE RULE ================= */
  const addRule = () => {
    const copy = structuredClone(data);
    copy[lang].sections[sectionIndex].rules.push("Nouvelle règle...");
    setData(copy);
  };

  const removeRule = (ruleIndex) => {
    const copy = structuredClone(data);
    copy[lang].sections[sectionIndex].rules.splice(ruleIndex, 1);
    setData(copy);
  };

  /* ================= SAVE + CONFIRMATION ================= */
  const handleSave = async () => {
    const updated = structuredClone(data);
    updated[lang].lastUpdate = new Date().toISOString().split("T")[0];

    setIsSaving(true);

    await fetch("/api/rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify(updated)
    });

    setData(updated);
    setIsSaving(false);
    setSaveSuccess(true);

    setTimeout(() => setSaveSuccess(false), 2000);
  };

  /* ================= PDF ================= */
  const generatePDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    let y = 18;

    /* ===== BACKGROUND ===== */
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, w, h, "F");

    /* ===== TITLE ===== */
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(content.title, w / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(content.subtitle, w / 2, y, { align: "center" });
    y += 6;

    doc.setFontSize(9);
    doc.text(
      `Version ${content.version} • ${content.lastUpdate}`,
      w / 2,
      y,
      { align: "center" }
    );
    y += 10;

    /* ===== IMPORTANT BLOCK (FINAL – WIDTH FIX) ===== */

    const boxX = 10;
    const boxWidth = w - 20;
    const paddingX = 10;
    const paddingTop = 8;
    const paddingBottom = 8;
    const titleHeight = 6;
    const lineHeight = 4.8;

    // largeur réelle du texte (clé du fix)
    const textWidth = boxWidth - paddingX * 2;

    // normalisation texte + wrap
    const rawLines = content.important.content
    .split("\n")
    .flatMap(line => doc.splitTextToSize(line, textWidth));

    // hauteur calculée
    const boxHeight =
    paddingTop +
    titleHeight +
    rawLines.length * lineHeight +
    paddingBottom;

    // cadre rouge
    doc.setFillColor(127, 29, 29);
    doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3, "F");

    // titre
    doc.setTextColor(254, 202, 202);
    doc.setFontSize(12);
    doc.text(
      content.important.title,
      boxX + paddingX,
      y + paddingTop
    );

    // texte
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);

    let textY = y + paddingTop + titleHeight;

    rawLines.forEach((line) => {
      doc.text(line, boxX + paddingX, textY);
      textY += lineHeight;
    });

    // espace après
    y += boxHeight + 6;

    /* ===== SECTIONS ===== */
    content.sections.forEach((section) => {
      doc.setFontSize(12);
      doc.setTextColor(96, 165, 250);
      doc.text(section.title, 10, y);
      y += 4;

      doc.setDrawColor(51, 65, 85);
      doc.line(10, y, w - 10, y);
      y += 4;

      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);

      section.rules.forEach((rule, i) => {
        const lines = doc.splitTextToSize(
          `${i + 1}. ${rule}`,
          w - 24
        );
        lines.forEach((line) => {
          doc.text(line, 14, y);
          y += 4.2;
        });
        y += 1.5;
      });

      y += 3;
    });

    /* ===== FOOTER ===== */
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "© 2026 StarLike Server. Tous droits réservés.",
      w / 2,
      h - 10,
      { align: "center" }
    );

    doc.save(
      lang === "fr"
      ? "StarLike_Reglement_FR.pdf"
      : "StarLike_Reglement_EN.pdf"
    );
  };


  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
    {/* HEADER */}
    <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
    <Shield className="text-white" />
    </div>
    <div>
    <h1 className="text-lg font-bold">StarLike Serveur</h1>
    <p className="text-xs text-slate-400">RÈGLEMENT IG</p>
    </div>
    </div>

    <div className="flex items-center gap-3">
    <div className="flex bg-slate-800 rounded-lg overflow-hidden">
  <button
    onClick={() => setLang("fr")}
    className={`px-3 py-1 font-bold ${
      lang === "fr" ? "bg-blue-600 text-white" : "text-slate-400"
    }`}
  >
    FR
  </button>
  <button
    onClick={() => setLang("en")}
    className={`px-3 py-1 font-bold ${
      lang === "en" ? "bg-blue-600 text-white" : "text-slate-400"
    }`}
  >
    EN
  </button>
</div>

    {isAdmin ? (
      <button
      onClick={() => setIsAdmin(false)}
      className="px-3 py-1 bg-red-500/20 text-red-400 rounded"
      >
      <LogOut size={14} />
      </button>
    ) : (
      <button
      onClick={() => setShowLogin(true)}
      className="px-3 py-1 bg-slate-800 rounded"
      >
      <Lock size={14} />
      </button>
    )}
    </div>
    </header>

    {/* MAIN */}
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">

    {/* IMPORTANT */}
    <div className="bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-500/20 rounded-2xl p-6 mb-8">
    <h2 className="text-red-400 font-bold mb-3 flex items-center gap-2">
    <AlertTriangle size={18} />
    {content.important.title}
    </h2>
    <p className="whitespace-pre-line">{content.important.content}</p>
    <button
    onClick={generatePDF}
    className="mt-4 px-4 py-2 bg-blue-600 rounded-lg font-bold"
    >
    📄 Télécharger le règlement
    </button>
    </div>

    {/* EXTERNAL LINKS */}
    <div className="mb-10 bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
    <h3 className="font-bold mb-5 text-slate-300">
    {lang === "fr" ? "Liens officiels" : "Official links"}
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {[
      { key: "vote", label: "Vote", icon: ThumbsUp },
      { key: "steam", label: "Steam", icon: Boxes },
      { key: "youtube", label: "YouTube", icon: Youtube },
      { key: "twitch", label: "Twitch", icon: Twitch },
      { key: "discord", label: "Discord", icon: MessageCircle }
    ].map(({ key, label, icon: Icon }) => {
      const url = content.externalLinks?.[key] || "";
      if (!url) return null;

      return (
        <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-blue-600 transition font-bold"
        >
        <Icon size={18} />
        {label}
        </a>
      );
    })}
    </div>
    </div>

    {/* SAVE BAR */}
    {isAdmin && (
      <div className="flex items-center gap-4 mb-6">
      <button
      onClick={handleSave}
      disabled={isSaving}
      className="px-5 py-2 bg-green-600 rounded-lg flex items-center gap-2 font-bold"
      >
      {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
      Sauvegarder
      </button>

      {saveSuccess && (
        <div className="flex items-center gap-2 text-green-400 font-bold">
        <CheckCircle size={18} />
        Sauvegarde réussie
        </div>
      )}
      </div>
    )}

    {/* CONTENT GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

    {/* MENU */}
    <nav className="lg:col-span-3 space-y-2">
    {content.sections.map((section) => {
      const Icon = IconMap[section.icon] || Shield;
      return (
        <button
        key={section.id}
        onClick={() => setActiveTab(section.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${
          activeTab === section.id
          ? "bg-blue-600 text-white"
          : "bg-slate-800/60"
        }`}
        >
        <Icon size={16} />
        {section.title}
        </button>
      );
    })}
      
    {/* HAUT STAFF */}
    <div className="mt-6">
      <StaffSection staff={staff} lang={lang} />
    </div>
    </nav>

    {/* CONTENT */}
    <div className="lg:col-span-9 bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
    <Shield size={18} />
    {activeSection.title}
    </h2>

    <div className="space-y-3">
    {activeSection.rules.map((rule, i) => (
      <div
      key={i}
      className="flex gap-3 bg-slate-900/60 rounded-xl p-4"
      >
      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 text-blue-400 font-bold text-sm">
      {i + 1}
      </span>

      {isAdmin ? (
        <>
        <textarea
        className="flex-1 bg-transparent resize-none outline-none"
        value={rule}
        onChange={(e) => {
          const copy = structuredClone(data);
          copy[lang].sections[sectionIndex].rules[i] =
          e.target.value;
          setData(copy);
        }}
        />
        <button
        onClick={() => removeRule(i)}
        className="text-red-400 hover:text-red-500"
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
      onClick={addRule}
      className="mt-4 w-full py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-blue-400 flex items-center justify-center gap-2"
      >
      <Plus size={18} /> Ajouter une règle
      </button>
    )}
    </div>
    </div>
    </div>
    


    </main>
    {/* FOOTER */}
    <footer className="bg-slate-900/80 border-t border-slate-800 text-center py-4 text-sm text-slate-400">
    © 2026 StarLike Server. Tous droits réservés.
    </footer>

    {/* LOGIN MODAL */}
    {showLogin && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <form
      onSubmit={submitLogin}
      className="bg-slate-900 p-6 rounded-xl w-80 border border-slate-700"
      >
      <h3 className="font-bold mb-4">Admin</h3>
      <input
      type="password"
      className="w-full p-2 bg-slate-800 rounded mb-2"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      {loginError && (
        <p className="text-red-400 text-sm mb-2">{loginError}</p>
      )}
      <button className="w-full bg-blue-600 py-2 rounded font-bold">
      Se connecter
      </button>
      </form>
      </div>
    )}
    </div>
  );
}
