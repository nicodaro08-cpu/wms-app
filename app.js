let warehouse = [], orders = [];

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function cargarEjemplo() {
  warehouse = [
    { id: 'A', x: 50, y: 50 },
    { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 350, y: 50 },
    { id: 'D', x: 50, y: 200 },
    { id: 'E', x: 200, y: 200 },
    { id: 'F', x: 350, y: 200 }
  ];
  orders = [
    { orden: 'ORD-001', zona: 'A' },
    { orden: 'ORD-001', zona: 'B' },
    { orden: 'ORD-002', zona: 'C' },
    { orden: 'ORD-003', zona: 'D' },
    { orden: 'ORD-003', zona: 'E' },
    { orden: 'ORD-004', zona: 'F' }
  ];
  dibujarPlano();
  showToast('Datos de ejemplo cargados');
}

function dibujarPlano() {
  const svg = document.getElementById('mapa');
  svg.innerHTML = '';
  warehouse.forEach(z => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', z.x);
    rect.setAttribute('y', z.y);
    rect.setAttribute('width', 80);
    rect.setAttribute('height', 80);
    rect.setAttribute('fill', '#444');
    rect.setAttribute('stroke', '#ffcc00');
    svg.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', z.x + 30);
    label.setAttribute('y', z.y + 45);
    label.textContent = z.id;
    label.setAttribute('fill', '#ffcc00');
    svg.appendChild(label);
  });
}

function optimizar() {
  if (!warehouse.length || !orders.length) {
    showToast('No hay datos cargados');
    return;
  }

  const zonas = orders.map(o => warehouse.find(z => z.id === o.zona));
  let recorrido = [];
  let actual = { x: 0, y: 0 };
  let restantes = [...zonas];

  while (restantes.length) {
    let siguiente = restantes.reduce((min, z) => {
      const dist = Math.hypot(z.x - actual.x, z.y - actual.y);
      return dist < min.dist ? { zona: z, dist } : min;
    }, { zona: null, dist: Infinity });
    recorrido.push(siguiente.zona);
    actual = siguiente.zona;
    restantes = restantes.filter(z => z !== siguiente.zona);
  }

  const distancia = recorrido.reduce((acc, z, i) => {
    const prev = i === 0 ? { x: 0, y: 0 } : recorrido[i - 1];
    return acc + Math.hypot(z.x - prev.x, z.y - prev.y);
  }, 0);

  document.getElementById('resumen').innerHTML = `
    <p><strong>Zonas recorridas:</strong> ${recorrido.map(z => z.id).join(' → ')}</p>
    <p><strong>Distancia total:</strong> ${distancia.toFixed(2)} unidades</p>
  `;
  showToast('Optimización completada');
}


