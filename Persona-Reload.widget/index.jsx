export const refreshFrequency = false;
export const className = 'top: 0; left: 0; width: 100%; height: 100%;';

// The menu launches apps itself via Übersicht's local /run/ endpoint;
// it only accepts bundle ids from src/config.js (see launch() in menu.js).
export const render = () => (
  <iframe
    title="Persona Reload — Mac app launcher"
    src="/Persona-Reload.widget/src/menu.html"
    style={{width: '100%', height: '100%', border: 0, display: 'block'}}
  />
);
