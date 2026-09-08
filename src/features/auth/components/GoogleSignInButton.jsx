import { useEffect, useRef } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Renders Google's own Identity Services button (script tag loaded in
 * index.html) inside our layout. We don't hand-roll the button because a
 * custom one can only trigger the One Tap prompt, which browsers throttle
 * after a dismissal — Google's rendered button is the reliable click target.
 */
export default function GoogleSignInButton({ onCredential, disabled }) {
  const { t, language } = useLanguage();
  const containerRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;

    function render() {
      if (cancelled || !containerRef.current) return;
      if (!window.google?.accounts?.id) {
        setTimeout(render, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onCredentialRef.current(response.credential),
      });

      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: 320,
        locale: language === "my" ? "my" : "en",
      });
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [language]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        title={t("Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in")}
        className="w-full cursor-not-allowed rounded-full border border-input bg-surface-inset px-4 py-2.5 text-sm font-medium text-muted-foreground"
      >
        {t("Continue with Google (not configured)")}
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className={disabled ? "pointer-events-none flex w-full justify-center opacity-50" : "flex w-full justify-center"}
    />
  );
}
