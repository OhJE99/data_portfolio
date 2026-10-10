(() => {
  const slides = [...document.querySelectorAll('.slide')];
  document.querySelector('.deck').setAttribute('aria-label', `오정은 포트폴리오 ${slides.length}페이지`);
  document.getElementById('total').textContent = slides.length;
  const numberedSlides = slides.filter(slide => !slide.classList.contains('title-cover') && !slide.dataset.pageCopyOf);
  const logicalPage = slide => {
    const sourceId = slide.dataset.pageCopyOf;
    const source = sourceId ? document.getElementById(sourceId) : slide;
    return numberedSlides.indexOf(source) + 1;
  };
  slides.filter(slide => !slide.classList.contains('title-cover')).forEach(slide => {
    const number = slide.querySelector('.slide-top span');
    if (number) number.textContent = `${String(logicalPage(slide)).padStart(2, '0')} / ${numberedSlides.length}`;
  });
  document.querySelectorAll('.contents-list a').forEach(link => {
    const start = slides.findIndex(slide => slide.id === link.dataset.pageStart);
    const end = slides.findIndex(slide => slide.id === (link.dataset.pageEnd || link.dataset.pageStart));
    if (start < 0 || end < 0) return;
    const page = index => String(logicalPage(slides[index])).padStart(2, '0');
    link.querySelector('.contents-pages').textContent = start === end ? page(start) : `${page(start)}–${page(end)}`;
  });
  slides.forEach(slide => {
    const windowFrame = document.createElement('div');
    windowFrame.className = 'browser-window';
    const bar = document.createElement('div');
    bar.className = 'browser-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<div class="browser-dots"><i></i><i></i><i></i></div><div class="browser-control">⌄</div>';
    const content = document.createElement('div');
    content.className = 'browser-content';
    while (slide.firstChild) content.appendChild(slide.firstChild);
    windowFrame.append(bar, content);
    slide.appendChild(windowFrame);
  });
  const current = document.getElementById('current');
  const go = index => slides[Math.max(0, Math.min(slides.length - 1, index))].scrollIntoView({behavior:'smooth', block:'start'});
  const activeIndex = () => {
    const mid = window.scrollY + window.innerHeight / 2;
    let best = 0;
    slides.forEach((slide, i) => { if (slide.offsetTop <= mid) best = i; });
    return best;
  };
  document.getElementById('prev').addEventListener('click', () => go(activeIndex() - 1));
  document.getElementById('next').addEventListener('click', () => go(activeIndex() + 1));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (visible) current.textContent = slides.indexOf(visible.target) + 1;
  }, {threshold:[.25,.5,.75]});
  slides.forEach(slide => observer.observe(slide));
  document.addEventListener('keydown', event => {
    if (['ArrowRight','PageDown'].includes(event.key)) { event.preventDefault(); go(activeIndex()+1); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); go(activeIndex()-1); }
  });
})();
