function noop() {}

function route(uri, update = noop, enter = noop,  exit = noop) {
  return {
    path: uri,
    enter,
    update,
    exit
  };
}

const EXIT = 2;
const ENTER = 1;
const UPDATE = 0;

function router(...routes) {
  let current = null;

  return function(url) {
    let state = (!current) ?
	1 :
	((current !== url) + (!!current));
    const route = routes.find(route => route.path === url);
    switch (state) {
    case EXIT: (
      routes.find(route => route.path === current).exit(),
      current = null
    );
    case ENTER: (route.enter(), current = url);
    case UPDATE: route.update();
    }
  };
}

module.exports = { router, route };
