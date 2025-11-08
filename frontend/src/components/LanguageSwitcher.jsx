import { useI18n } from "../contexts/I18nContext.jsx";

function LanguageSwitcher() {
  const { locale, setLocale, availableLocales, t } = useI18n();

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.85rem",
      }}
    >
      <span>{t("layout.languageLabel", "Idioma")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        style={{
          borderRadius: "8px",
          padding: "4px 8px",
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.1)",
          color: "inherit",
        }}
      >
        {availableLocales.map((code) => (
          <option key={code} value={code}>
            {t(`locales.${code}`, code.toUpperCase())}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;
