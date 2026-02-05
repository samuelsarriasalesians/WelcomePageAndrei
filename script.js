const vCardData = {
    name: "Andrei",
    phone: "+34653082707",
    email: "3467716535.ru@gmail.com",
    url: window.location.href
};

/**
 * Muestra la tarjeta con animación
 */
function showCard(event) {
    if (event) event.stopPropagation();
    const card = document.querySelector('.card');
    const btn = document.querySelector('.button');
    if (card) {
        card.classList.add('show-card');
        hapticFeedback(15);
    }
    if (btn) btn.style.display = 'none';
}

/**
 * Alterna el giro de la tarjeta
 */
function toggleFlip(event) {
    if (event) event.stopPropagation();
    const card = document.querySelector('.card');
    if (card) {
        card.classList.toggle('is-flipped');
        hapticFeedback(10);
    }
}

/**
 * Feedback háptico (vibración)
 */
function hapticFeedback(ms = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

/**
 * Genera y descarga el archivo vCard
 */
function downloadVCard() {
    hapticFeedback(20);
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
 * API de compartir nativa o fallback
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

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Enlace copiado al portapapeles');
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
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Efecto Ripple para botones
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Quitar overlay de escaneo
    setTimeout(() => {
        const overlay = document.querySelector('.scan-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    }, 1500);

    // Asignar eventos ripple
    document.querySelectorAll('.nav-item, .button').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
});
