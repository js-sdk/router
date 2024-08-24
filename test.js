/* @jest-environment jsdom */

const { router, route } = require('./index.js');
const { T, N, patch } = require('js-sdk-vdom');

function noop() {}

const ROUTE_1_ENTER = 'route_1_enter';
const ROUTE_1_UPDATE = 'route_1_update';
const ROUTE_1_EXIT = 'route_1_exit';

const ROUTE_2_ENTER = 'route_2_enter';
const ROUTE_2_UPDATE = 'route_2_update';
const ROUTE_2_EXIT = 'route_2_exit';

describe('building routes', () => {
  it('root route', () => {
    const tags = [];
    function tag(t) { return function () { tags.push(t); } }

    const { path, enter, update, exit } =
	  route(
	    '/',
	    tag(ROUTE_1_UPDATE),
	    tag(ROUTE_1_ENTER),
	    tag(ROUTE_1_EXIT)
	  );

    expect(path).toEqual('/');
    expect(enter).not.toBeNull();
    expect(update).not.toBeNull();
    expect(exit).not.toBeNull();
  });
  it('root with a path', () => {

    const tags = [];
    function tag(t) { return function () { tags.push(t); } }

    const { path, enter, update, exit } =
	  route(
	    '/a/b/c',
	    tag(ROUTE_1_UPDATE),
	    tag(ROUTE_1_ENTER),
	    tag(ROUTE_1_EXIT)
	  );

    expect(path).toEqual('/a/b/c');
    expect(enter).not.toBeNull();
    expect(update).not.toBeNull();
    expect(exit).not.toBeNull();
  });
});

describe('using router', () => {
  it('entering a route', () => {
    const tags = [];
    function tag(t) { return function () { tags.push(t); } }
    const r = router(
      route('/', tag(ROUTE_1_UPDATE), tag(ROUTE_1_ENTER), tag(ROUTE_1_EXIT)),
    );

    r('/');
    expect(tags).toEqual([ROUTE_1_ENTER, ROUTE_1_UPDATE]);
  });

  it('exiting and entering a route', () => {
    const tags = [];
    function tag(t) { return function () { tags.push(t); } }
    const r = router(
      route('/a', tag(ROUTE_1_UPDATE), tag(ROUTE_1_ENTER), tag(ROUTE_1_EXIT)),
      route('/b', tag(ROUTE_2_UPDATE), tag(ROUTE_2_ENTER), tag(ROUTE_2_EXIT)),
    );

    r('/a');
    r('/b');

    expect(tags).toEqual([ROUTE_1_ENTER, ROUTE_1_UPDATE, ROUTE_1_EXIT, ROUTE_2_ENTER, ROUTE_2_UPDATE]);
  });
});

describe('rendering test', () => {
  const app = (function (target) {
    let p; return function (view) { p = patch(p, view(), target); }
  }(document.body));

  function list() {
    const ls = [1, 2, 3].map(n => T(n.toString()));
    return N('ul', { id: 'list' }, {}, ls);
  }

  function image() {
    return N('img', { id: 'img' }, {}, []);
  }

  const r = router(
    route('/a', () => app(list)),
    route('/b', () => app(image))
  );

  it('entering route `/a`', () => {
    r('/a');
    expect(document.body.firstChild.id).toBe('list');
  });

  it('rounting to route `/b`', () => {
    r('/b');
    expect(document.body.firstChild.id).toBe('img');
  });
});
