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
/* Images */
const images = [
  'blau',
  'gelb',
  'grau',
  'gruen',
  'n-blau',
  'n-gelb',
  'n-grau',
  'n-gruen',
  'n-neulandgrau',
  'petr',
  'n-rot',
  'neulandgrau',
  'petrol',
  'rot'
]
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
  const imageFactor = Math.floor(Math.random() * images.length);
  const animationTopFactor = ( Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1);
  const animationLeftFactor = ( Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1);
  return {
    top: topFactor * 10,
    left: leftFactor* 10,
    width: sizeFactor * 32,
    height: sizeFactor * 45,
    x: animationLeftFactor * 10,
    y: animationTopFactor *10,
    imageFactor
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
    {class: 'egg', style: `top: ${eggProb.top}%; left: ${eggProb.left}%; width: ${eggProb.width}px;`, click: function(){
      state.counter += 1;
      state.eggs -= 1;
      Life.removeElement(this);
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
    }},
    Life.img({src: `./assets/egg/egg-${images[eggProb.imageFactor]}.svg`})
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
