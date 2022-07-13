function noop() {}

function route(update = noop, enter = noop,  exit = noop, nest = null) {
  return { enter, update, exit, nest };
}

const EXIT = 2;
const ENTER = 1;
const UPDATE = 0;

function router(routes) {
  let stack = null;

  return function(url) {
    let state = (stack === 0) ?
	1 :
	((stack != url) + (!!stack));
    const route = routes[url];
    switch (state) {
    case EXIT: (routes[stack].exit(), stack = null);
    case ENTER: (route.enter(), stack = url);
    case UPDATE: route.update();
    }
  };
}

module.exports = { router, route };
