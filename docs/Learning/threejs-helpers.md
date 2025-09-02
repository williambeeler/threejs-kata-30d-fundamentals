# Three.js Helpers

## Axes Helper (in-built function for Three.js)

This will create an Axes Helper at the size of 5. You can toggle it as well:

```
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
folder.add(axesHelper, 'visible').name('Axes helper toggle')
```

## Wireframe

Use the Material to apply the wireframe to. Wireframe as a dropdown:

```
folder.add(material, 'wireframe', { Solid: false, WireFrame: true }).name('Wireframe')
```

The wireframe as a checkbox:

```
folder.add(material, 'wireframe').name('Wireframe')
```