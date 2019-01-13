// A generic string hashing function taken from stack overflow
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hashOk(str) {
  var hash = 0
  var i
  var chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// A bad hashing function with many collisions
function hashBad(str) {
  return str.charCodeAt(0) || 0
}

function HashMap(hashingFunc) {
  /* use an array to hold mappings
   * hashed keys to be used as array indicies, with key-value pairs stored
   * in sub-arrays due to potential collisions
   * e.g. if hash of key1 is the same as key2,
   * this.arr[hashedKey1] = [[key1, value1], [key2, value2]]
   */
  this.arr = []

  // Key hashing function
  this.hash = hashingFunc || hashOk
}

HashMap.prototype.set = function(key, val) {
  // TODO: input validation #YOLO

  // hash key to an index
  var idx = this.hash(key.toString())
  if (this.arr[idx]) {
    /* collision with hashed key
     * either we are overriding an existing value in the map or
     * have to account for distinct keys sharing a hashed index
     */
    var kvPairs = this.arr[idx]
    for (var k = 0; k < kvPairs.length; k++) {
      if (kvPairs[k][0] === key) {
        // overriding an existing value with a new one
        this.arr[idx][k][1] = val
        return
      }
    }
    // exhausted all existing keys, so we have a hash collision

    // add new key-value pair
    this.arr[idx].push([key, val])
  } else {
    /* first time we've encountered this hashed key, store unhashed key and
     * value in anticipation of collisions
     */
    this.arr[idx] = [[key, val]]
  }
  return
}

HashMap.prototype.get = function(key) {
  // TODO: input validation #YOLO

  // hash key to an index
  var idx = this.hash(key.toString())

  // check for existence in map
  if (!this.arr[idx]) {
    // found nothing
    return
  } else {
    // search for exact key match, since there might be collisions
    var kvPairs = this.arr[idx]
    for (var k = 0; k < kvPairs.length; k++) {
      if (kvPairs[k][0] === key) {
        return kvPairs[k][1]
      }
    }
    return
  }
}

function testCases() {
  var map = new HashMap

  // Add a -> 1
  map.set('a', 1)

  // Add foo -> bar
  map.set('foo', 'bar')

  // Update foo -> baz
  map.set('foo', 'baz')

  var noop = function() {}
  // Add noop -> function() {}
  map.set('noop', noop)

  var sayHi = function() {console.log('hi')}
  // Add sayHi -> function() {console.log('hi')}
  map.set('sayHi', sayHi)

  console.log(map.get('a')) // 1
  console.log(map.get('foo')) // 'baz'
  console.log(map.get('noop')) // [Function: noop]
  map.get('sayHi')() // hi
  console.log(map.get('undef')) // undefined

  // Check functionality with collisions
  var map2 = new HashMap(hashBad)

  // Set up collisions with key 'a'
  map2.set('a', 1)
  map2.set('aa', 2)
  map2.set('ab', 3)
  map2.set('ac', 4)
  map2.set('ad', 5)

  // Set up collisions with key 'b'
  map2.set('b', 6)
  map2.set('ba', 7)
  map2.set('bb', 8)
  map2.set('bc', 9)
  map2.set('bd', 10)

  console.log(map2.get('a'))
  console.log(map2.get('aa'))
  console.log(map2.get('ab'))
  console.log(map2.get('ac'))
  console.log(map2.get('ad'))
  console.log(map2.get('b'))
  console.log(map2.get('ba'))
  console.log(map2.get('bb'))
  console.log(map2.get('bc'))
  console.log(map2.get('bd'))
}

testCases()
