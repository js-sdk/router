function noop() {}

function segmentUri(uri) {
  return uri.slice(1).split('/').filter(x => !!x);
}

function route(uri, update = noop, enter = noop,  exit = noop) {
  return {
    path: uri,
    segments: segmentUri(uri),
    enter,
    update,
    exit
  };
}

function match(segments, uri) {
  const uriSegments = segmentUri(uri);
  if (segments.length !== uriSegments.length) {
    return [false, []];
  }

  const params = {};
  for (let x = 0; x < segments.length; x++) {
    let param = segments[x][0] === ':';
    let segment = param ? segments[x].slice(1) : segments[x];

    if (param) {
      params[segment] = uriSegments[x];
    } else if (segment !== uriSegments[x]) {
      return [false, []];
    }
  }
  return [true, params];
}

function matchRoute(routes, uri) {
  for (let route of routes) {
    const [matched, params] = match(route.segments, uri);
    if (matched) {
      return [route, params];
    }
  }
  return [];
}

const EXIT = 2;
const ENTER = 1;
const UPDATE = 0;

function router(...routes) {
  let currentRoute = null;
  let currentParams = null;

  return function(uri) {
    let state = currentRoute ?
	(currentRoute.path !== uri) + (!!currentRoute) : 1;
    const [route, params] = matchRoute(routes, uri);
    switch (state) {
    case EXIT: (
      currentRoute && currentRoute.exit(currentParams),
      currentRoute = null,
      currentParams = null
    );
    case ENTER: (
      route.enter(params),
      currentRoute = route,
      currentParams = params
    );
    case UPDATE: currentRoute.update(currentParams);
    }
  };
}

module.exports = { router, route };
