function noop() {}

function route(update = noop, enter = noop,  exit = noop) {
  return { enter, update, exit };
}

const EXIT = 2;
const ENTER = 1;
const UPDATE = 0;

function router(routes) {
  let current = null;

  return function(url) {
    let state = (!current) ?
	1 :
	((current !== url) + (!!current));
    const route = routes[url];
    switch (state) {
    case EXIT: (routes[current].exit(), current = null);
    case ENTER: (route.enter(), current = url);
    case UPDATE: route.update();
    }
  };
}

module.exports = { router, route };
