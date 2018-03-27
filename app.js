'use strict';

// function dragElement(elmnt, mode) {
//   let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//
//   const isTouch = 'ontouchstart' in window;
//
//   if(isTouch) {
//     elmnt.ontouchstart = dragMouseDown;
//   } else {
//     elmnt.onmousedown = dragMouseDown;
//   }
//
//   function dragMouseDown(e) {
//     e = e || window.event;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//
//     if(isTouch) {
//       document.ontouchcancel = closeDragElement;
//       document.ontouchmove = elementDrag;
//     } else {
//       document.onmouseup = closeDragElement;
//       document.onmousemove = elementDrag;
//     }
//   }
//
//   function elementDrag(e) {
//     e = e || window.event;
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }
//
//   function closeDragElement(e) {
//     console.log(e);
//
//     document.onmouseup = null;
//     document.onmousemove = null;
//     document.ontouchcancel = null;
//     document.ontouchmove = null;
//
//     if(e.clientX < 300 && e.clientY < 300) {
//       Life.removeElement(elmnt)
//       state.counter += 1;
//       state.eggs -= 1;
//       if(state.eggs === 0) {
//
//         if(mode.name === 'easy') {
//           Success.data.message = `Du hast es trotz Kater in ${Counter.data.timer} Sekunden geschafft, Glückwunsch. :)`;
//         } else if(mode.name === 'medium') {
//           Success.data.message = `Mit ${Counter.data.timer} Sekunden bist du vielleicht doch mehr als "nur" ein durchschnittlicher Osterhase, Glückwunsch. `;
//         } else if (mode.name === 'hard') {
//           Success.data.message = `Gelöst in ${Counter.data.timer} Sekunden, heute definitiv keinen Kaffee mehr, Glückwunsch. ;)`;
//         }
//         Success.render();
//       }
//     }
//   }
//
// }

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

  /* Colors */
};var colors = ['rgb(255,184,13)', 'rgb(0,204,38)', 'rgb(204, 0, 61)', 'rgb(23, 193, 204)', 'rgb(137, 136, 144)', 'rgb(60, 60, 60)', 'rgb(28, 125, 146)'];

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
  var colorFactor = Math.floor(Math.random() * 7);

  var animationTopFactor = Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1;
  var animationLeftFactor = Math.round(Math.random()) > 0.5 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * -5) + 1;

  return {
    top: topFactor * 10,
    left: leftFactor * 10,
    width: sizeFactor * 32,
    height: sizeFactor * 45,
    x: animationLeftFactor * 10,
    y: animationTopFactor * 10,
    colorFactor: colorFactor
  };
};

/* Dialog */
var Intro = new Life.Component({

  name: 'intro',
  template: function template() {
    var _this = this;

    return Life.div({ class: 'container' }, Life.div({ class: 'bunny' }, Life.img({ src: 'assets/bunny.svg' })), Life.div({ class: 'inside' }, Life.h1({ class: 'title' }, 'NEULAND. Oster-Online-Spiel'), Life.div({ class: 'text' }, 'Ziel des Spiels ist es alle Eier zu sammeln.'), Life.div({ class: 'options' }, Life.button('Stufe 1: Osterhase mit Kater', { click: function click() {
        initGame(easy);
        _this.remove();
      } }), Life.button('Stufe 2: Durchschnittlicher Osterhase', { click: function click() {
        initGame(medium);
        _this.remove();
      } }), Life.button('Stufe 3: Osterhase mit Koffein-Überdosis', { click: function click() {
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

    return Life.div({ class: 'inside' }, Life.a({ class: 'logo' }, Life.img({ src: './assets/logo.svg' })), Life.h2({ class: 'title' }, this.data.message), Life.a({ class: 'button', href: 'javascript:window.location.reload(true)' }, 'Nochmal spielen'));
  },

  mount: document.querySelector('#app'),
  data: {
    message: ''
  }
});

var DragContainer = new Life.Component({
  name: 'DragContainer',
  template: function template() {
    return Life.div({ id: 'dropzone' }, Life.img({ src: 'assets/easter-game-jan-03.svg' }));
  },

  mount: document.querySelector('#app')
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
  var el = Life.div({ class: 'egg', draggable: true, style: 'background-color: ' + colors[eggProb.colorFactor] + ';top: ' + eggProb.top + '%; left: ' + eggProb.left + '%; width: ' + eggProb.width + 'px; height: ' + eggProb.height + 'px' }, Life.span({ class: 'logo' }, 'N.'));
  el.animate([{ transform: 'translate(0, 0)' }, { transform: 'translate(' + eggProb.x + 'px, ' + eggProb.y + 'px)' }, { transform: 'translate(0, 0)' }], {
    duration: 3000,
    iterations: Infinity
  });
  return el;
};

var initGame = function initGame(config) {

  Life.renderElement(Life.div({ class: 'eggscontainer' }));
  DragContainer.render();
  for (var i = 0; i < 10; i++) {
    Life.renderElement(egg(config), document.querySelector('.eggscontainer'));
  }

  var draggable = new Draggable.Draggable(document.querySelector('#app'), {
    draggable: '.egg'
    // droppable: '#dropzone'
  });

  draggable.on('drag', function () {
    return console.log('droppable:over');
  });

  setInterval(function () {

    if (state.eggs > 0 && state.eggs < config.maxEggs) {
      Life.renderElement(egg(config), document.querySelector('.eggscontainer'));
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
