/* global __dirname */

var test = require('tape');
var Annoy = require('../index');

var annoyPath = __dirname + '/data/test.annoy';

test('Add test', addTest);
test('Load test', loadTest);

function addTest(t) {
  var obj = new Annoy(10, 'Angular');

  obj.addItem(0, [-5.0, -4.5, -3.2, -2.8, -2.1, -1.5, -0.34, 0, 3.7, 6]);
  obj.addItem(1, [5.0, 4.5, 3.2, 2.8, 2.1, 1.5, 0.34, 0, -3.7, -6]);
  obj.addItem(2, [0, 0, 0, 0, 0, -1, -1, -0.2, 0.1, 0.8]);
  
  t.equal(obj.getNItems(), 3, 'Index has all the added items.');

  obj.build();
  obj.save(annoyPath);
  t.end();
}

function loadTest(t) {
  var obj2 = new Annoy(10, 'Angular');
  var loadResult = obj2.load(annoyPath);
  t.ok(loadResult, 'Loads successfully.');

  if (loadResult) {
    console.log('Loaded annoy index!');
    console.log('Number of items in index:', obj2.getNItems());
    var v1 = obj2.getItem(0);
    var v2 = obj2.getItem(1);
    console.log('Gotten vectors:', v1, v2);
    var sum = [];
    for (var i = 0; i < v1.length; ++i) {
      sum.push(v1[i] + v2[i]);
    }
    console.log('Sum:', sum);
    var neighbors = obj2.getNNsByVector(sum, 10, -1, false);
    t.ok(Array.isArray(neighbors), 'NN result is an array.');
    console.log('Nearest neighbors to sum', neighbors);

    var nnResult = obj2.getNNsByVector(sum, 10, -1, true);
    t.equal(typeof nnResult, 'object', 'NN result is an object.');
    t.ok(Array.isArray(nnResult.neighbors), 'NN result has a neighbors array.');
    t.ok(Array.isArray(nnResult.distances), 'NN result has a distances array.');
    console.log('Nearest neighbors to sum with distances', nnResult);
  }

  t.end();
}