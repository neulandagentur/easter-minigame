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

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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
}});

const DragContainer = new Life.Component({
  name: 'DragContainer',
  template() {
    return(
      Life.div({id: 'dropzone'},
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
)},
data: {
  timer: 0
},
mount: document.querySelector('#app')
});


// This is where the eggs come from
const egg = (mode) => {
  const eggProb = getProberties();
  let el = Life.div(
    {class: 'egg', draggable: true, style: `background-color: ${colors[eggProb.colorFactor]};top: ${eggProb.top}%; left: ${eggProb.left}%; width: ${eggProb.width}px; height: ${eggProb.height}px`},
    Life.span({class: 'logo'}, 'N.')
  );
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
  for(let i = 0; i < state.eggs; i++) {
    Life.renderElement(egg(config))
  }

  const draggable = new Draggable.Draggable(document.querySelector('#app'), {
    draggable: '.egg',
  });

  draggable.on('drag:start', (e) => {
    e.originalSource.style.display = 'none';
  });

  draggable.on('drag:stop', (e) => {

    if(offset(e.mirror).top < DragContainer.element.offsetHeight && offset(e.mirror).left < DragContainer.element.offsetWidth ) {
      DragContainer.element.querySelector('img').setAttribute('src', 'assets/easter-game-jan-02.svg');
      Life.removeElement(e.mirror);
      Life.removeElement(e.source);
      Life.removeElement(e.originalSource);
      state.eggs -= 1;

      if(state.eggs === 0) {

        if(config.name === 'easy') {
          Success.data.message = `Du hast es trotz Kater in ${Counter.data.timer} Sekunden geschafft, Glückwunsch. :)`;
        } else if(config.name === 'medium') {
          Success.data.message = `Mit ${Counter.data.timer} Sekunden bist du vielleicht doch mehr als "nur" ein durchschnittlicher Osterhase, Glückwunsch. `;
        } else if (config.name === 'hard') {
          Success.data.message = `Gelöst in ${Counter.data.timer} Sekunden, heute definitiv keinen Kaffee mehr, Glückwunsch. ;)`;
        }
        Success.render();
      }

    } else {
      console.table(e);
      e.originalSource.style.top = offset(e.mirror).top + 'px';
      e.originalSource.style.left = offset(e.mirror).left + 'px';
      // e.originalSource.setAttribute('style',e.mirror.getAttribute('style'));
    }

  });


  setInterval(function(){

    if(state.eggs > 0 && state.eggs < config.maxEggs) {
      Life.renderElement(egg())
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
