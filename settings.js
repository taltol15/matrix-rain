// ממשק ההגדרות — טוען, שומר ומפעיל את האפקט
const $ = (id) => document.getElementById(id);

const fields = ['color', 'speed', 'density', 'fontSize', 'charset', 'customText', 'fade', 'fullscreen'];

function readForm() {
  return {
    color: $('color').value,
    speed: Number($('speed').value),
    density: Number($('density').value),
    fontSize: Number($('fontSize').value),
    charset: $('charset').value,
    customText: $('customText').value || '01',
    fade: Number($('fade').value),
    fullscreen: $('fullscreen').checked
  };
}

function applyForm(cfg) {
  $('color').value = cfg.color || '#00ff00';
  $('speed').value = cfg.speed;
  $('density').value = cfg.density;
  $('fontSize').value = cfg.fontSize;
  $('charset').value = cfg.charset || 'katakana';
  $('customText').value = cfg.customText || 'TRUSTNO1';
  $('fade').value = cfg.fade;
  $('fullscreen').checked = !!cfg.fullscreen;
  syncLabels();
  toggleCustom();
}

function syncLabels() {
  $('speedVal').textContent = $('speed').value;
  $('densityVal').textContent = $('density').value;
  $('fontSizeVal').textContent = $('fontSize').value;
  $('fadeVal').textContent = $('fade').value;
}

function toggleCustom() {
  $('customWrap').style.display = $('charset').value === 'custom' ? 'flex' : 'none';
}

['speed', 'density', 'fontSize', 'fade'].forEach((id) => {
  $(id).addEventListener('input', syncLabels);
});
$('charset').addEventListener('change', toggleCustom);

$('start').addEventListener('click', async () => {
  const cfg = readForm();
  await window.matrixAPI.saveConfig(cfg);
  await window.matrixAPI.startMatrix(cfg);
});

// שמירה שקטה כשסוגרים / משנים
window.addEventListener('beforeunload', () => {
  window.matrixAPI.saveConfig(readForm());
});

(async () => {
  const cfg = await window.matrixAPI.getConfig();
  applyForm(cfg);
})();
