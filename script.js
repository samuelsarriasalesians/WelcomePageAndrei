const vCardData = {
  name: "Andrei Trubnikov",
  phone: "+34653082707",
  email: "3467716535.ru@gmail.com",
  url: window.location.href
};

/**
 * Alterna el giro de la tarjeta (Flip 3D)
 */
function toggleFlip(event) {
  if (event) event.stopPropagation();
  const card = document.querySelector(".card");
  if (card) {
    card.classList.toggle("is-flipped");
    hapticFeedback(12);
  }
}

/**
 * Feedback háptico refinado
 */
function hapticFeedback(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/**
 * Genera y descarga el archivo vCard sin librerías
 */
function downloadVCard() {
  hapticFeedback(18);

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${vCardData.name}`,
    `TEL;TYPE=CELL:${vCardData.phone}`,
    `EMAIL:${vCardData.email}`,
    `URL:${vCardData.url}`,
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${vCardData.name}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/**
 * API de compartir nativa (Web Share API)
 */
async function shareProfile() {
  hapticFeedback(14);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Contacto de ${vCardData.name}`,
        text: "Tarjeta de contacto",
        url: window.location.href
      });
      return;
    } catch (err) {
      if (err && err.name !== "AbortError") console.error("Share error:", err);
    }
  }

  // Fallback a copiar
  copyToClipboard(window.location.href);
}

/**
 * Copiar al portapapeles robusto + Toast
 */
function copyToClipboard(text) {
  // Clipboard API requiere HTTPS en muchos casos.
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast("Enlace copiado"));
    return;
  }

  // Fallback clásico
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("Enlace copiado");
  } catch {
    showToast("No se pudo copiar");
  }
  ta.remove();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

/**
 * Ripple discreto
 */
function createRipple(event) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  // Si viene de teclado (sin clientX/Y) centramos
  const clientX = event.clientX ?? (rect.left + rect.width / 2);
  const clientY = event.clientY ?? (rect.top + rect.height / 2);

  const x = clientX - rect.left - size / 2;
  const y = clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  const prev = el.querySelector(".ripple");
  if (prev) prev.remove();

  el.appendChild(ripple);
}

/**
 * Inicialización
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", createRipple, { passive: true });
  });
});
