function dragElement(elmnt, mode) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const isTouch = 'ontouchstart' in window;

  if(isTouch) {
    elmnt.ontouchstart = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;

    if(isTouch) {
      document.ontouchcancel = closeDragElement;
      document.ontouchmove = elementDrag;
    } else {
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
    console.log(e);

    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchcancel = null;
    document.ontouchmove = null;

    if(e.clientX < 300 && e.clientY < 300) {
      Life.removeElement(elmnt)
      state.counter += 1;
      state.eggs -= 1;
      if(state.eggs === 0) {

        if(mode.name === 'easy') {
          Success.data.message = `Du hast es trotz Kater in ${Counter.data.timer} Sekunden geschafft, Glückwunsch. :)`;
        } else if(mode.name === 'medium') {
          Success.data.message = `Mit ${Counter.data.timer} Sekunden bist du vielleicht doch mehr als "nur" ein durchschnittlicher Osterhase, Glückwunsch. `;
        } else if (mode.name === 'hard') {
          Success.data.message = `Gelöst in ${Counter.data.timer} Sekunden, heute definitiv keinen Kaffee mehr, Glückwunsch. ;)`;
        }
        Success.render();
      }
    }
  }

}

/* Config */

const easy = {
  name: 'easy',
  maxEggs: 15,
  interval: 2000
}

const medium = {
  name: 'medium',
  maxEggs: 20,
  interval: 1000
}

const hard = {
  name: 'hard',
  maxEggs: 30,
  interval: 500
}

/* Colors */
const colors = [
  'rgb(255,184,13)',
  'rgb(0,204,38)',
  'rgb(204, 0, 61)',
  'rgb(23, 193, 204)',
  'rgb(137, 136, 144)',
  'rgb(60, 60, 60)',
  'rgb(28, 125, 146)'
];

/* State management */
const state = {
  eggs: 10,
  getEggs() {
    return state.eggs.toString();
  }
}

/* Mount app */
Life.setMountNode(document.querySelector('#app'));

/* Func that returns the egg proberties */
const getProberties = () => {
  const topFactor = Math.floor(Math.random() * 8) + 1;
  const leftFactor = Math.floor(Math.random() * 8) + 1;
  const sizeFactor = Math.floor(Math.random() * 5) + 2;
  const colorFactor = Math.floor(Math.random() * 7);

  const animationTopFactor = ( Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1);
  const animationLeftFactor = ( Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1);

  return {
    top: topFactor * 10,
    left: leftFactor* 10,
    width: sizeFactor * 32,
    height: sizeFactor * 45,
    x: animationLeftFactor * 10,
    y: animationTopFactor *10,
    colorFactor
  }
}


/* Dialog */
const Intro = new Life.Component({

  name: 'intro',
  template() {
    return (

      Life.div({class: 'container'},
      Life.div({class: 'bunny'}, Life.img({src: 'assets/bunny.svg'})),
      Life.div({class: 'inside'},
      Life.h1({class: 'title'}, 'NEULAND. Oster-Online-Spiel'),
      Life.div({class: 'text'}, 'Ziel des Spiels ist es alle Eier zu sammeln.'),
      Life.div({class: 'options'},
      Life.button('Stufe 1: Osterhase mit Kater', {click: () => {
        initGame(easy);
        this.remove();
      }}),
      Life.button('Stufe 2: Durchschnittlicher Osterhase', {click: () => {
        initGame(medium);
        this.remove();
      }}),
      Life.button('Stufe 3: Osterhase mit Koffein-Überdosis', {click: () =>{
        initGame(hard);
        this.remove();
      }})
    )
  )
)

)
},
mount: document.querySelector('#app')
});

Intro.render();

const Success = new Life.Component({
  name: 'success',
  template() {

    return (
      Life.div({class: 'inside'},
      Life.a({class: 'logo'},
      Life.img({src: './assets/logo.svg'})
    ),
    Life.h2({class: 'title'}, this.data.message),
    Life.a({class: 'button', href: 'javascript:window.location.reload(true)'}, 'Nochmal spielen')
  )
)
},
mount: document.querySelector('#app'),
data: {
  message: ''
}
})

const DragContainer = new Life.Component({
  name: 'DragContainer',
  template() {
    return(
      Life.div({class: 'container'},
      Life.img({src: 'assets/easter-game-jan-03.svg'})
    )
  )
},
mount: document.querySelector('#app')
})





/* Counter Compoent */
const Counter = new Life.Component({
  name: 'counter-comp',
  template() {
    return(
      Life.div({class: 'counter'},
      Life.p('Timer: ',
      Life.span(this.data.timer.toString())
    )
  )
)
},
data: {
  timer: 0
},
mount: document.querySelector('#app')
})


// This is where the eggs come from
const egg = (mode) => {
  const eggProb = getProberties();
  let el = Life.div(
    {class: 'egg', draggable: true, style: `background-color: ${colors[eggProb.colorFactor]};top: ${eggProb.top}%; left: ${eggProb.left}%; width: ${eggProb.width}px; height: ${eggProb.height}px`},
    Life.span({class: 'logo'}, 'N.')
  );
  dragElement(el, mode);
  el.animate(
    [
      {transform: 'translate(0, 0)'},
      {transform: `translate(${eggProb.x}px, ${eggProb.y}px)`},
      {transform: 'translate(0, 0)'}
    ], {
      duration: 3000,
      iterations: Infinity
    }
  )
  return el;
}

const initGame = config => {
  DragContainer.render();
  for(let i = 0; i < 10; i++) {
    Life.renderElement(egg(config))
  }

  setInterval(function(){

    if(state.eggs > 0 && state.eggs < config.maxEggs) {
      Life.renderElement(egg(config))
      state.eggs += 1;
    }

  }, config.interval)

  Counter.render();
  const Timer = setInterval(function(){
    if(state.eggs > 0) {
      Counter.data.timer += 1;
      Counter.update();
    }
  }, 1000);

}
