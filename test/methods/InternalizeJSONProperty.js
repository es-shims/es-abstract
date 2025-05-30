'use strict';

var forEach = require('for-each');
var v = require('es-value-fixtures');
var debug = require('object-inspect');

module.exports = function (t, year, InternalizeJSONProperty) {
	t.ok(year >= 2015, 'ES2015+');

	forEach(v.primitives, function (primitive) {
		t['throws'](
			function () { InternalizeJSONProperty(primitive, '', function () {}); },
			TypeError,
			debug(primitive) + ' is not an Object'
		);
	});

	forEach(v.nonStrings, function (nonString) {
		t['throws'](
			function () { InternalizeJSONProperty({}, nonString, function () {}); },
			TypeError,
			debug(nonString) + ' is not a String'
		);
	});

	forEach(v.nonFunctions, function (nonFunction) {
		t['throws'](
			function () { InternalizeJSONProperty({}, 'a', nonFunction); },
			TypeError,
			debug(nonFunction) + ' is not a function'
		);
	});

	t.deepEqual(
		InternalizeJSONProperty({ a: { b: { c: 1 } } }, 'a', function (name, val) { return val; }),
		{ b: { c: 1 } }
	);

	t.deepEqual(
		InternalizeJSONProperty({ a: [{ b: { c: 1 } }, { d: 2 }] }, 'a', function (name, val) { return val; }),
		[{ b: { c: 1 } }, { d: 2 }]
	);

	// eslint-disable-next-line consistent-return
	var noD = function (name, val) { if (name !== 'd') { return val; } };

	t.deepEqual(
		InternalizeJSONProperty({ a: [{ b: { c: 1 } }, { d: 2, e: 3 }] }, 'a', noD),
		[{ b: { c: 1 } }, { e: 3 }],
		'reviver drops a nested property in an array'
	);

	// eslint-disable-next-line consistent-return
	var noZero = function (name, val) { if (name !== '0') { return val; } };
	t.deepEqual(
		InternalizeJSONProperty({ a: [{ b: { c: 1 } }, { d: 2, e: 3 }] }, 'a', noZero),
		[, { d: 2, e: 3 }], // eslint-disable-line no-sparse-arrays
		'reviver drops a nested index in an array'
	);

	t.deepEqual(
		InternalizeJSONProperty({ a: { d: 2, e: 3 } }, 'a', noD),
		{ e: 3 },
		'reviver drops a nested property in an object'
	);

	t.deepEqual(
		InternalizeJSONProperty({ d: [{ b: { c: 1 } }, { d: 2, e: 3 }] }, 'd', noD),
		undefined,
		'reviver drops a top-level property'
	);

	t.deepEqual(
		InternalizeJSONProperty({ a: 1, b: 2 }, 'a', function (name, val) { return val; }),
		1
	);

	// TODO: stuff with the reviver
};
