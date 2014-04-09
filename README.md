set.js
===

set.js is a little library for working with number sets represented in mathematical set notation. It exposes a single function `setBuilder` that acts as a constructor, and returns an object which represents a lazy evaluation of the set.

What are sets?
----

Sets are basically groups of items that are related somehow. For example, you could have a set of fruits, whose members are apple, banana, and orange. You could also have a set of people, whose members are John, Victor, and Mary.

In mathematics, sets are usually groups of numbers. For example, the set of natural numbers is that which contains all numbers from 1 to infinity. This kind of numeric sets are the ones we are interested on, and the ones we can work with using set.js. That is because representing a set of fruits in set notation is a bit too hard. Maybe, if you could define a rule for how fruits compare to each other, you could do it, but I will leave fruit managing to my neighbor who sells delicious fruit cocktails.

Set Notation
---

Set notation is a convenient way to represent sets. Think for a moment about our set of fruits. In set notation we could represent it like this:

`{apple, banana, orange}`

As you can see, set notation uses curly braces (`{`) to delimit the set, and its members are listed separated by a comma (`,`). This is all nice, and beautiful, but not very useful... yet.

How would you represent a set of numbers from 1 to 5?

`{1,2,3,4,5}`

What about 1 to 1000?

You could list all the numbers, but that would take you a long time, and it would get boring after the first few numbers. Not to mention error prone. However, it is still possible to write that set. But what about the set of all natural numbers? We are out of luck there if we wanted to list them all because they stretch all the way to infinity. This is where the power of set notation really shines.

Our set from 1 to 1000 can be written as:

`{1, 2, ..., 1000}`

and the set of all natural numbers is:

`{1, 2, ...}`

As you can see, we use `...` to indicate that the numbers continue in the same fashion. The `...` is called the ellipsis, but don't worry too much about the fancy names.

set.js allows you to take set notation into the world of javascript. There are some limitations due to the nature of computers, and maybe to my lack of creativity, but for the most part, you can take a set of numbers, represent it in set notation, pass the representation to set.js, and it will give you back the evaluated set.

setBuilder
---

The `setBuilder` function is the entry point to the world of sets in set.js. It take a single parameter, which is the representation of the set in set notation:

```
var my_set = setBuilder('{0, 5, ..., 100}');
```

the thing that you get back when you call the function is an object that represents the set. An important thing to notice is that, because sets can be really big, the object that you get back is lazy evaluated set. This means that no element is evaluated until it is absolutely necessary. This is great for performance, and it makes sure your memory is not chewed up by huge sets

The Set Object
---

As previously mentioned, the set object is the representation of your set. It has a few nice methods that you can use:

### parse(template);

The parse method parses a template and sets some internal variables. Consider this to be an implementation detail for internal use only. It will most likely be hidden later on, which will effectively remove it from the exposed methods. Do not use it.

### head();

The `head` pops and returns the first element in the set. If you call `head` twice on a set like `{1, 2, 3, 4}` The first time you get `1`, and the second time you get `2`. If there are no more element in the set, it returns `false`.

### tail();

Returns all but the first elements in a set. Notice that by doing:

```
my_set.head();
my_set.tail();
```

You end up loosing an element. This is because `head` will pop the first element in the set, and tail will act in the resulting set. You will effectively loose the head of the resulting set:

```
// my_set is {1,2,3,4,5}
var h = my_set.head(); // h = 1, my_set = {2,3,4,5}
var t = my_set.tail(); // t = {3,4,5}, you lost the head (2)
```

### next(count);

Returns an array of `count` next elements. `count` defaults to 1. This method allows you to get more than one element at a time. Just like `head` it pops the elements that it retrieves, so the resulting set after `count` is applied, is the original set, minus the extracted elements.

Notice that `head()` and `next()` return different values. `head()` returns the first element of the set, and `next()` returns an array containing the first element in the set. This is an important distinction between the two methods.

### nextAll();

Returns an array containing all the elements left in the set. If called right after initializing the set, it returns the full set. This is useful when you want to get the full set, rather than a lazy evaluated representation. Notice that if there are no more element in the set, `nextAll` returns an empty array, while `next` returns an array whose members are `false`. This is intentional to make sure that `next` always returns an array that has `count` members.

### peek();

It gets the next element in the set, but without moving the head. If called multiple times, you get the same value every time because the head is not advanced. If there is no next element, it returns `false`

### serializeAll();

It returns a string representing the original set in set notation. It effectively gives you back the string you passed to the constructor function.

### serialize();

It returns a string representing the set in set notation. It differs from `serializeAll` in that it builds a new set notation representation that represents only the items left in the set, rather than the full original set. It returns `false` if the set has been consumed.

### serializeTail();

It pops the head of the set, and serializes the remaining set using serialize. Note that it advances the head.

### rewind();

Rewinds the set making it possible to start again with the set as if it had been just generated. The head is moved to its original position.

Implementation Details
---

- Infinite sets are far from infinity. The largest value in a set is 2^53, which is the larges integer in js. This means that `{0, 1, ...}` Is actually `{0, 1, ..., 2^53}` This should be enough for most practical purposes.

- Only the first and second element are considered when determining the pattern that the set follows. This means that a set like this `{1,2, 4, ...}` is translated into `{1,2, ...}`

- The following sets make no sense:
```
{1, ...}
{1, ..., 100, ...}
```
They will throw an exception.

- Sets that start with an ellipsis are not supported. `{..., 100}` throws an exception.


What is next?
---

I started this as a simple exercise after getting the idea from an article that I'm writing called js for the brain. I'm not really sure I will continue to extend set.js, but if I do, it will most likely implement functions to do set arithmetic, and member operations.
