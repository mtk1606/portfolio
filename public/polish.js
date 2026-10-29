const pageNav = [...document.querySelectorAll('header nav a[href^="#"]')];
const trackedSections = pageNav
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.section);

function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  const progress = range > 0 ? Math.min(100, Math.max(0, scrollY / range * 100)) : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
}

if (trackedSections.length && 'IntersectionObserver' in window) {
  const visible = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target.id, entry.intersectionRatio));
    const active = trackedSections
      .filter(({ section }) => (visible.get(section.id) || 0) > 0)
      .sort((a, b) => (visible.get(b.section.id) || 0) - (visible.get(a.section.id) || 0))[0];
    pageNav.forEach(link => link.removeAttribute('aria-current'));
    active?.link.setAttribute('aria-current', 'location');
  }, { rootMargin: '-20% 0px -58% 0px', threshold: [0, .15, .35, .6] });
  trackedSections.forEach(({ section }) => observer.observe(section));
}

let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateProgress();
    ticking = false;
  });
}, { passive: true });
addEventListener('resize', updateProgress, { passive: true });
updateProgress();
