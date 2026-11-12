'use strict';

const viewer = document.querySelector('.viewer');
if (viewer && typeof viewer.showModal === 'function') {
  const image = viewer.querySelector('.viewer-scroll img');
  const scrollArea = viewer.querySelector('.viewer-scroll');
  const title = viewer.querySelector('#diagram-title');
  const original = viewer.querySelector('.viewer-original');
  const close = viewer.querySelector('.viewer-close');
  const reset = viewer.querySelector('[data-scale="reset"]');
  const zoomLevels = [0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];
  let zoomIndex = 1;
  let opener;

  function setZoom(index) {
    zoomIndex = Math.min(zoomLevels.length - 1, Math.max(0, index));
    const percent = `${Math.round(zoomLevels[zoomIndex] * 100)}%`;
    image.style.setProperty('--diagram-width', percent);
    reset.textContent = percent;
    viewer.querySelector('[data-scale="down"]').disabled = zoomIndex === 0;
    viewer.querySelector('[data-scale="up"]').disabled = zoomIndex === zoomLevels.length - 1;
  }

  function openDiagram(url, name, trigger) {
    opener = trigger;
    title.textContent = name;
    image.alt = name;
    image.src = url;
    original.href = url;
    setZoom(1);
    viewer.showModal();
    document.body.classList.add('viewer-open');
    scrollArea.scrollTo(0, 0);
    close.focus();
  }

  for (const link of document.querySelectorAll('[data-zoom]')) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openDiagram(link.href, link.querySelector('img').alt, link);
    });
  }
  for (const button of document.querySelectorAll('[data-zoom-url]')) {
    button.hidden = false;
    button.addEventListener('click', () => {
      openDiagram(button.dataset.zoomUrl, button.dataset.zoomTitle, button);
    });
  }
  viewer.querySelector('[data-scale="down"]').addEventListener('click', () => setZoom(zoomIndex - 1));
  viewer.querySelector('[data-scale="up"]').addEventListener('click', () => setZoom(zoomIndex + 1));
  reset.addEventListener('click', () => setZoom(1));
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener?.focus();
  });
}
