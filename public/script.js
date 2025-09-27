document.addEventListener('DOMContentLoaded',()=>{

  // Footer year
  document.getElementById('year').textContent=new Date().getFullYear();

  // Custom cursor
  const cursor=document.querySelector('.custom-cursor');
  let mouse={x:window.innerWidth/2,y:window.innerHeight/2}, pos={x:mouse.x,y:mouse.y};

  window.addEventListener('mousemove',e=>{
    mouse.x=e.clientX; mouse.y=e.clientY;
  });

  function animateCursor(){
    pos.x+=(mouse.x-pos.x)*0.18; pos.y+=(mouse.y-pos.y)*0.18;
    cursor.style.transform=`translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Cursor hover/click
  const interactiveEls=document.querySelectorAll('.cta, .card, .navlinks a');
  interactiveEls.forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
    el.addEventListener('mousedown',()=>cursor.classList.add('click'));
    el.addEventListener('mouseup',()=>cursor.classList.remove('click'));
  });

  // Card tilt + click
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      const dx=(x-rect.width/2)/(rect.width/2);
      const dy=(y-rect.height/2)/(rect.height/2);
      card.style.transform=`rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='rotateX(0deg) rotateY(0deg) scale(1)';});
    card.addEventListener('mousedown',()=>{card.style.transform='rotateX(0deg) rotateY(0deg) scale(0.97)';});
    card.addEventListener('mouseup',()=>{card.style.transform='rotateX(0deg) rotateY(0deg) scale(1.02)';});
  });

});
