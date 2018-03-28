'use strict';

/* Config */
var easy = {
  name: 'easy',
  maxEggs: 15,
  interval: 2000
};
var medium = {
  name: 'medium',
  maxEggs: 20,
  interval: 1000
};
var hard = {
  name: 'hard',
  maxEggs: 30,
  interval: 500
  /* Images */
};var images = ['blau', 'gelb', 'grau', 'gruen', 'n-blau', 'n-gelb', 'n-grau', 'n-gruen', 'n-neulandgrau', 'petr', 'n-rot', 'neulandgrau', 'petrol', 'rot'];
/* State management */
var state = {
  eggs: 10,
  getEggs: function getEggs() {
    return state.eggs.toString();
  }
};
/* Mount app */
Life.setMountNode(document.querySelector('#app'));
/* Func that returns the egg proberties */
var getProberties = function getProberties() {
  var topFactor = Math.floor(Math.random() * 8) + 1;
  var leftFactor = Math.floor(Math.random() * 8) + 1;
  var sizeFactor = Math.floor(Math.random() * 5) + 2;
  var imageFactor = Math.floor(Math.random() * images.length);
  var animationTopFactor = Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1;
  var animationLeftFactor = Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1;
  return {
    top: topFactor * 10,
    left: leftFactor * 10,
    width: sizeFactor * 32,
    height: sizeFactor * 45,
    x: animationLeftFactor * 10,
    y: animationTopFactor * 10,
    imageFactor: imageFactor
  };
};
/* Dialog */
var Intro = new Life.Component({
  name: 'intro',
  template: function template() {
    var _this = this;

    return Life.div({ class: 'container' }, Life.div({ class: 'bunny' }, Life.img({ src: 'assets/bunny.svg' })), Life.div({ class: 'inside' }, Life.h1({ class: 'title' }, 'NEULAND. Oster-Online-Spiel'), Life.div({ class: 'text' }, 'Ziel des Spiels ist es alle Eier zu sammeln.'), Life.div({ class: 'options' }, Life.a('Stufe 1: Osterhase mit Kater', { class: 'button', click: function click() {
        initGame(easy);
        _this.remove();
      } }), Life.a('Stufe 2: Durchschnittlicher Osterhase', { class: 'button', click: function click() {
        initGame(medium);
        _this.remove();
      } }), Life.a('Stufe 3: Osterhase mit Koffein-Überdosis', { class: 'button', click: function click() {
        initGame(hard);
        _this.remove();
      } }))));
  },

  mount: document.querySelector('#app')
});
Intro.render();
var Success = new Life.Component({
  name: 'success',
  template: function template() {
    return Life.div({ class: 'inside' }, Life.a({ class: 'logo', href: 'https://www.neuland-agentur.com' }, Life.img({ src: './assets/logo.svg' })), Life.h2({ class: 'title' }, this.data.message), Life.a({ class: 'button', href: 'javascript:window.location.reload(true)' }, 'Nochmal spielen'));
  },

  mount: document.querySelector('#app'),
  data: {
    message: ''
  }
});
/* Counter Compoent */
var Counter = new Life.Component({
  name: 'counter-comp',
  template: function template() {
    return Life.div({ class: 'counter' }, Life.p('Timer: ', Life.span(this.data.timer.toString())));
  },

  data: {
    timer: 0
  },
  mount: document.querySelector('#app')
});
// This is where the eggs come from
var egg = function egg(mode) {
  var eggProb = getProberties();
  var el = Life.div({ class: 'egg', style: 'top: ' + eggProb.top + '%; left: ' + eggProb.left + '%; width: ' + eggProb.width + 'px;', click: function click() {
      state.counter += 1;
      state.eggs -= 1;
      Life.removeElement(this);
      if (state.eggs === 0) {
        if (mode.name === 'easy') {
          Success.data.message = 'Du hast es trotz Kater in ' + Counter.data.timer + ' Sekunden geschafft, Gl\xFCckwunsch. :)';
        } else if (mode.name === 'medium') {
          Success.data.message = 'Mit ' + Counter.data.timer + ' Sekunden bist du vielleicht doch mehr als "nur" ein durchschnittlicher Osterhase, Gl\xFCckwunsch. ';
        } else if (mode.name === 'hard') {
          Success.data.message = 'Gel\xF6st in ' + Counter.data.timer + ' Sekunden, heute definitiv keinen Kaffee mehr, Gl\xFCckwunsch. ;)';
        }
        Success.render();
      }
    } }, Life.img({ src: './assets/egg/egg-' + images[eggProb.imageFactor] + '.svg' }));
  el.animate([{ transform: 'translate(0, 0)' }, { transform: 'translate(' + eggProb.x + 'px, ' + eggProb.y + 'px)' }, { transform: 'translate(0, 0)' }], {
    duration: 3000,
    iterations: Infinity
  });
  return el;
};
var initGame = function initGame(config) {
  for (var i = 0; i < 10; i++) {
    Life.renderElement(egg(config));
  }
  setInterval(function () {
    if (state.eggs > 0 && state.eggs < config.maxEggs) {
      Life.renderElement(egg(config));
      state.eggs += 1;
    }
  }, config.interval);
  Counter.render();
  var Timer = setInterval(function () {
    if (state.eggs > 0) {
      Counter.data.timer += 1;
      Counter.update();
    }
  }, 1000);
};
