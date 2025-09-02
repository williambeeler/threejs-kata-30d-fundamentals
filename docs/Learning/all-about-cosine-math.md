# All About Cosine in Math

This is a continuation of [this article](/docs/Learning/all-about-sine-math.md).

### 1. What cosine is

* Still the same circle as before.

* But instead of looking at the **vertical height** (sine), cosine is the **horizontal position** of that point.

👉 So **cosine = left and right wobble** on the circle.

- - -

### 2. The **shape of cosine**

* Just like sine, cosine makes a smooth wave that repeats forever between **-1 and +1**.

* The only difference is the **starting point**:

  * Sine starts at 0.

  * Cosine starts at 1.

So mathematically, **cosine is just sine shifted over a bit** (a “phase shift”).

- - -

### 3. Why it’s useful

* Anywhere you need smooth left/right or back/forth motion.

* Combine with sine and you can describe **circular or elliptical motion**:

  * `x = cos(t)`

  * `y = sin(t)`\
    That’s literally a circle!

- - -

### 4. Mental analogy

Think:

* **Sine** = “up and down” on the Ferris wheel.

* **Cosine** = “left and right” on the Ferris wheel.

Together, they describe the whole ride. 🎡

- - -

### 5. Quick code example in Three.js

If you want your torus to **move in a circle instead of just bobbing**:

```js
const radius = 5;
const speed = 1.0;
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  torus.position.x = radius * Math.cos(t * speed);
  torus.position.y = radius * Math.sin(t * speed);

  renderer.render(scene, camera);
}
animate();
```

That’s just sine and cosine together: perfect circle motion.