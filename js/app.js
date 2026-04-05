function toggleLegend(){
  const el = document.getElementById('legend');
  el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function simulatePop(count){
  const log = document.getElementById('log');
  log.innerHTML = "Popped " + count + " blocks<br>";

  if(count === 8){
    log.innerHTML += "💣 Bomb Activated (3x3)<br>";
  }

  if(count >= 10){
    triggerVideo();
  }
}

function triggerVideo(){
  document.getElementById('videoBox').style.display = 'block';
}
