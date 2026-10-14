import { useEffect } from "react";
import { setSetting, useStore, type Settings } from "../store";
import { IconClose } from "../icons";

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div className="setting">
      <span>{label}</span>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={String(v)} role="radio" aria-checked={value === v} onClick={() => onChange(v)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="setting setting--toggle">
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function ReadingSettings() {
  const { settings: s } = useStore();
  return (
    <div className="settings">
      <Segmented<Settings["lang"]> label="Meaning in" value={s.lang} options={[["en", "English"], ["hi", "हिन्दी"]]} onChange={(v) => setSetting("lang", v)} />
      {s.lang === "en" && (
        <Segmented<Settings["translation"]>
          label="Translation"
          value={s.translation}
          options={[["en", "Clear"], ["en2", "Poetic"]]}
          onChange={(v) => setSetting("translation", v)}
        />
      )}
      <Toggle label="In simple words" hint="A plain explanation under every verse" on={s.showSimple} onChange={(v) => setSetting("showSimple", v)} />
      <Toggle label="Sanskrit" hint="Original Devanagari" on={s.showSanskrit} onChange={(v) => setSetting("showSanskrit", v)} />
      <Toggle label="Transliteration" hint="Sanskrit in English letters" on={s.showTranslit} onChange={(v) => setSetting("showTranslit", v)} />
      <Segmented<Settings["textSize"]> label="Text size" value={s.textSize} options={[[0, "A"], [1, "A+"], [2, "A++"]]} onChange={(v) => setSetting("textSize", v)} />
      <Segmented<Settings["theme"]>
        label="Appearance"
        value={s.theme}
        options={[["system", "Auto"], ["light", "Light"], ["dark", "Dark"]]}
        onChange={(v) => setSetting("theme", v)}
      />
      <Toggle label="Sound effects" hint="Soft taps, chimes and a temple bell" on={s.sounds} onChange={(v) => setSetting("sounds", v)} />
    </div>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <button className="sheet__scrim" aria-label="Close" onClick={onClose} />
      <div className="sheet__panel">
        <header>
          <h2>{title}</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
