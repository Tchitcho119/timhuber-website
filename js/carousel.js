(function () {
  'use strict';

  var track = document.getElementById('carousel-track');
  if (!track) return;

  var prevBtn  = document.getElementById('carousel-prev');
  var nextBtn  = document.getElementById('carousel-next');
  var prevBtnM = document.getElementById('carousel-prev-m');
  var nextBtnM = document.getElementById('carousel-next-m');

  /* ── Build infinite clone ring ──────────────────────────────── */
  var origCards = Array.prototype.slice.call(track.querySelectorAll('.carousel-card'));
  var n = origCards.length;

  // Append clones of all originals → [orig×n | clone×n]
  origCards.forEach(function (card) {
    track.appendChild(card.cloneNode(true));
  });
  // Prepend clones of all originals → [clone×n | orig×n | clone×n]
  origCards.slice().reverse().forEach(function (card) {
    track.insertBefore(card.cloneNode(true), track.firstChild);
  });

  var allCards = track.querySelectorAll('.carousel-card');

  /* current index points into allCards; real items start at index n */
  var current = n;
  var sliding  = false;

  /* ── Helpers ─────────────────────────────────────────────────── */
  function cardW() {
    return allCards[0] ? allCards[0].getBoundingClientRect().width : 0;
  }
  function gap() {
    return parseInt(window.getComputedStyle(track).columnGap) || 20;
  }
  function step() { return cardW() + gap(); }

  function moveTo(idx, instant) {
    current = idx;
    var offset = current * step();
    if (instant) {
      track.style.transition = 'none';
      track.style.transform  = 'translateX(-' + offset + 'px)';
      track.getBoundingClientRect(); // force reflow
      track.style.transition = '';
    } else {
      track.style.transform = 'translateX(-' + offset + 'px)';
    }
  }

  /* ── Slide one step ──────────────────────────────────────────── */
  function slide(dir) {
    if (sliding) return;
    sliding = true;
    moveTo(current + dir, false);
  }

  /* ── After transition: snap if on cloned edge ────────────────── */
  track.addEventListener('transitionend', function () {
    sliding = false;
    // Wrapped past end into leading clones → jump to real end
    if (current < n) {
      moveTo(current + n, true);
    }
    // Wrapped past start into trailing clones → jump to real start
    if (current >= 2 * n) {
      moveTo(current - n, true);
    }
  });

  /* ── Button handlers ─────────────────────────────────────────── */
  function onPrev() { slide(-1); }
  function onNext() { slide(1);  }

  prevBtn.addEventListener('click', onPrev);
  nextBtn.addEventListener('click', onNext);
  if (prevBtnM) prevBtnM.addEventListener('click', onPrev);
  if (nextBtnM) nextBtnM.addEventListener('click', onNext);

  /* ── Touch / swipe ───────────────────────────────────────────── */
  var touchX = 0;
  track.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) slide(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ── Resize: recalculate without animation ───────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { moveTo(current, true); }, 80);
  });

  /* ── Init ────────────────────────────────────────────────────── */
  moveTo(n, true);
}());
