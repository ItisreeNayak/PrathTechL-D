// Lightweight, zero-dependency confetti effect for celebration micro-interactions
export const triggerConfetti = () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '99999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const colors = ['#6366f1', '#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
  const particleCount = 70;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 8 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 0.2;

    particle.style.position = 'absolute';
    particle.style.left = `${startX}px`;
    particle.style.top = '-20px';
    particle.style.width = `${size}px`;
    particle.style.height = `${size * (Math.random() > 0.5 ? 1 : 2)}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = Math.random() > 0.4 ? '2px' : '50%';
    particle.style.opacity = '1';
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    particle.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), top ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease-in`;

    container.appendChild(particle);

    setTimeout(() => {
      const endX = startX + (Math.random() * 200 - 100);
      particle.style.top = `${window.innerHeight + 50}px`;
      particle.style.transform = `translate(${endX - startX}px, 0) rotate(${Math.random() * 720}deg)`;
      particle.style.opacity = '0';
    }, delay * 1000 + 10);
  }

  setTimeout(() => {
    container.remove();
  }, 3500);
};

