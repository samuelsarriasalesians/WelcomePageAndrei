const vCardData = {
    name: "Andrei",
    phone: "+34653082707",
    email: "3467716535.ru@gmail.com",
    url: window.location.href
};

/**
 * Alterna el giro de la tarjeta (Flip 3D)
 */
function toggleFlip(event) {
    if (event) event.stopPropagation();
    const card = document.querySelector('.card');
    if (card) {
        card.classList.toggle('is-flipped');
        hapticFeedback(15);
    }
}

/**
 * Feedback háptico refinado
 */
function hapticFeedback(ms = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

/**
 * Genera y descarga el archivo vCard sin librerías
 */
function downloadVCard() {
    hapticFeedback(25);
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${vCardData.name}
TEL;TYPE=CELL:${vCardData.phone}
EMAIL:${vCardData.email}
URL:${vCardData.url}
END:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const newLink = document.createElement('a');
    newLink.download = `${vCardData.name}.vcf`;
    newLink.href = url;
    newLink.click();
    URL.revokeObjectURL(url);
}

/**
 * API de compartir nativa (Web Share API)
 */
async function shareProfile() {
    hapticFeedback(20);
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Contacto de ${vCardData.name}`,
                url: window.location.href
            });
        } catch (err) {
            if (err.name !== 'AbortError') console.error('Error sharing:', err);
        }
    } else {
        copyToClipboard();
    }
}

/**
 * Copiar al portapapeles con Toast
 */
function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Enlace copiado');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/**
 * Efecto Ripple discreto
 */
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    const prevRipple = button.getElementsByClassName('ripple')[0];
    if (prevRipple) prevRipple.remove();

    button.appendChild(ripple);
}

// Inicialización mobile-ready
document.addEventListener('DOMContentLoaded', () => {
    // Eventos Ripple para toda la barra inferior
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
});
