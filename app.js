let amigos = [];

function adicionarAmigo() {
  const nomeInput = document.getElementById('amigo');
  const nome = nomeInput.value.trim();

  if (!nome) {
    alert("Digite um nome válido!");
    return;
  }

  if (amigos.includes(nome)) {
    alert("Esse nome já foi adicionado!");
    nomeInput.value = '';
    return;
  }

  amigos.push(nome);
  atualizarLista();

  nomeInput.value = '';
  nomeInput.focus();
}

function atualizarLista() {
  const lista = document.getElementById('listaAmigos');
  lista.innerHTML = '';

  amigos.forEach((amigo, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const nomeTexto = document.createElement('span');
    nomeTexto.textContent = amigo;
    
    const botoes = document.createElement('div');

    const btnEditar = document.createElement('button');
    btnEditar.textContent = "✏️";
    btnEditar.title = "Editar nome"; 
    btnEditar.style.border = 'none';
    btnEditar.style.background = 'transparent';
    btnEditar.style.cursor = 'pointer';
    btnEditar.style.fontSize = '1.2em';
    btnEditar.onclick = () => editarAmigo(index);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = "❌";
    btnExcluir.title = "Excluir nome"; 
    btnExcluir.style.border = 'none';
    btnExcluir.style.background = 'transparent';
    btnExcluir.style.cursor = 'pointer';
    btnExcluir.style.fontSize = '1.2em';
    btnExcluir.style.marginLeft = '8px';
    btnExcluir.onclick = () => excluirAmigo(index);

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    li.appendChild(nomeTexto);
    li.appendChild(botoes);
    lista.appendChild(li);
  });
}

function editarAmigo(index) {
  const nomeAtual = amigos[index];
  const novoNome = prompt("Editar nome:", nomeAtual);

  if (novoNome && novoNome.trim() !== "") {
    amigos[index] = novoNome.trim(); 
    atualizarLista();
  }
}

function excluirAmigo(index) {
  const nomeParaExcluir = amigos[index];
  if (confirm(`Tem certeza que deseja excluir "${nomeParaExcluir}"?`)) {
    amigos.splice(index, 1); 
    atualizarLista();
  }
}


let canvas, ctx, startAngle = 0, arc, spinTimeout = null;
let spinAngleStart = 0, spinTime = 0, spinTimeTotal = 0;

function desenharRoleta() {
  canvas = document.getElementById("roleta");
  if (!canvas) return;

  canvas.style.display = 'block'; 
  
  ctx = canvas.getContext("2d");
  let outsideRadius = 150;
  let textRadius = 120;
  let insideRadius = 50;

  ctx.clearRect(0,0,500,500);

  arc = Math.PI / (amigos.length / 2);

  for(let i = 0; i < amigos.length; i++) {
    let angle = startAngle + i * arc;
    ctx.fillStyle = i % 2 === 0 ? "#FFCC00" : "#FF6666";
    ctx.beginPath();
    ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
    ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                  250 + Math.sin(angle + arc / 2) * textRadius);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(amigos[i], -ctx.measureText(amigos[i]).width/2, 0);
    ctx.restore();
  }

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(250 - 4, 250 - (outsideRadius + 20));
  ctx.lineTo(250 + 4, 250 - (outsideRadius + 20));
  ctx.lineTo(250 + 4, 250 - (outsideRadius - 20));
  ctx.lineTo(250 + 9, 250 - (outsideRadius - 20));
  ctx.lineTo(250 + 0, 250 - (outsideRadius - 30));
  ctx.lineTo(250 - 9, 250 - (outsideRadius - 20));
  ctx.lineTo(250 - 4, 250 - (outsideRadius - 20));
  ctx.lineTo(250 - 4, 250 - (outsideRadius + 20));
  ctx.fill();
}

function girarRoleta() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  girarAnimacao();
}

function girarAnimacao() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    pararRoleta();
    return;
  }
  let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  desenharRoleta();
  spinTimeout = setTimeout(girarAnimacao, 30);
}

function pararRoleta() {
  clearTimeout(spinTimeout);
  let degrees = startAngle * 180 / Math.PI + 90;
  let arcd = arc * 180 / Math.PI;
  let index = Math.floor((360 - (degrees % 360)) / arcd);
  
  const resultadoEl = document.getElementById('resultado');
  resultadoEl.innerHTML = `<li>🎉 O amigo sorteado foi: <strong>${amigos[index]}</strong></li>`;
  
  setTimeout(() => {
    if (canvas) canvas.style.display = 'none';
  }, 4000);
}

function easeOut(t, b, c, d) {
  let ts = (t/=d)*t;
  let tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

function sortearAmigo() {
  if (amigos.length < 2) {
    alert("Adicione pelo menos 2 amigos!");
    return;
  }

  document.getElementById('resultado').innerHTML = ''; 
  desenharRoleta();
  girarRoleta();
}