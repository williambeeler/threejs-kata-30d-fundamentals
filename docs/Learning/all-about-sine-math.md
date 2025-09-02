# All About Sine in Math

### 1. What **sine (sin)** is

* Imagine a circle.

* Pick a point that goes around the circle at a steady speed.

* Now, instead of watching the circle, you only look at the **height** of that point as it goes around.

* That “height” is the **sine** value.

👉 So sine is really just **the vertical wobble of a point moving around a circle**.

- - -

### 2. The **shape of sine**

* If you graph it over time, you get a smooth, wavy line.

* It always goes up and down between **-1 and +1**.

* Starts at 0 → goes up to +1 → back to 0 → down to -1 → back to 0 → repeat forever.

That’s one **wave cycle**.

- - -

### 3. Why it’s useful in animations

* Because it **never stops oscillating**.

* No need to check “am I at the top yet?” — sine handles the up-and-down automatically.

* By scaling and shifting, you can fit it into any range you want:

  * Multiply it (e.g. `2 * sin(x)`) → makes the wave taller (bigger up and down).

  * Add something (e.g. `5 + sin(x)`) → moves the wave higher/lower on the screen.

  * Multiply the inside (e.g. `sin(2 * x)`) → makes it go faster (more waves).

- - -

### 4. Mental analogy

Think of it like:

* **Ferris wheel seat** → going up and down smoothly.

* **Pendulum** → swinging left and right.

* **Breathing** → inhale (up), exhale (down), repeat.

That’s sine in action.

## Visual Example

![](/docs/Learning/media/sin-math.png "Circle and Sin Example")

* **Left (Circle):** Imagine a point moving around the circle. The red dashed line shows its **vertical height** — that’s the sine value.

* **Right (Wave):** As time goes on and the point moves around the circle, those heights form the smooth **sine wave**.

This is why sine repeats, goes up and down forever, and stays between -1 and +1.

## Sine in Three.js Code

```
const top = 5, bottom = 0;
const amp = (top - bottom) / 2;
const mid = (top + bottom) / 2;
const speed = 1.5; // radians/sec
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  torus.position.y = mid + amp * Math.sin(t * speed);
  renderer.render(scene, camera);
}
animate();

```

For cosine, [click here.](/docs/Learning/all-about-cosine-math.md)