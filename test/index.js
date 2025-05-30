'use strict';

var ES = require('../');
var test = require('tape');
var keys = require('object-keys');
var forEach = require('for-each');

var ESkeys = keys(ES).sort();
var ES6keys = keys(ES.ES6).sort();

test('exposed properties', function (t) {
	t.deepEqual(ESkeys, ES6keys.concat([
		'ES2025',
		'ES2024',
		'ES2023',
		'ES2022',
		'ES2021',
		'ES2020',
		'ES2019',
		'ES2018',
		'ES2017',
		'ES7',
		'ES2016',
		'ES6',
		'ES2015',
		'ES5'
	]).sort(), 'main ES object keys match ES6 keys');
	t.end();
});

test('methods match', function (t) {
	forEach(ES6keys, function (key) {
		t.equal(ES.ES6[key], ES[key], 'method ' + key + ' on main ES object is ES6 method');
	});
	t.end();
});

require('./GetIntrinsic');

require('./helpers');
require('./bufferTestCases');

require('./es5');
require('./es6');
require('./es2015');
require('./es7');
require('./es2016');
require('./es2017');
require('./es2018');
require('./es2019');
require('./es2020');
require('./es2021');
require('./es2022');
require('./es2023');
require('./es2024');
require('./es2025');
