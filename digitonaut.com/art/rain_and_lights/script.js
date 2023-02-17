class MathUtils {
  constructor() {}

  lerp(a, b, n) {
    return n * (b - a) + a;
  }
  
  to(obj, time, set) {
    const start = performance.now();
    const duration = time * 1000;
    return new Promise(resolve => {
      this.opts = {
        obj,
        time,
        duration,
        start,
        set,
        resolve
      };
      this.update();
    });
  }

  update() {
    const now = performance.now();
    const p = (now - this.opts.start) / this.opts.duration;

    if (p >= 1) {
      this.opts.completed = true;
      return this.opts.resolve();
    }

    for (let v in this.opts.set) {
      this.opts.obj[v] = this.lerp(
        this.opts.obj[v],
        this.opts.set[v],
        this.outElastic(p)
      );
    }

    requestAnimationFrame(this.update);
  }
}

const init = () => {
  const content = document.querySelector(".content-canvas");
  const shader = {
    v: document.querySelector("#vertex").textContent,
    f: document.querySelector("#fragment").textContent
  };
  const mathUtils = new MathUtils();
  const mouse = {
    x: 0,
    y: 0
  };
  const gl = {
    renderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    ),
    scene: new THREE.Scene(),
    loader: new THREE.TextureLoader(),
    clock: new THREE.Clock()
  };

  const uniforms = {
    u_time: { type: "f", value: 0 },
    u_res: { type: "v2", value: new THREE.Vector2(innerWidth, innerHeight) },
    u_mouse: { type: "v2", value: new THREE.Vector2(0, 0) }
  };

  const addScene = () => {
    gl.renderer.setPixelRatio(devicePixelRatio);
    gl.renderer.setSize(innerWidth, innerHeight);
    gl.camera.position.z = 5;
    content.append(gl.renderer.domElement);
    gl.scene.add(gl.camera);
  };

  const addMesh = () => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.v,
      fragmentShader: shader.f
    });

    gl.mesh = new THREE.Mesh(geometry, material);

    gl.scene.add(gl.mesh);
  };

  let elapsed = 0;
  const update = e => {
    elapsed = gl.clock.getElapsedTime();
    uniforms.u_time.value = elapsed;

    uniforms.u_mouse.value.x = mathUtils.lerp(
      uniforms.u_mouse.value.x,
      mouse.x,
      0.05
    );
    uniforms.u_mouse.value.y = mathUtils.lerp(
      uniforms.u_mouse.value.y,
      mouse.y,
      0.05
    );

    render();
    requestAnimationFrame(update);
  };

  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
    gl.renderer.setSize(w, h);
    gl.camera.aspect = w / h;

    // calculate scene
    const dist = gl.camera.position.z - gl.mesh.position.z;
    const height = 1;
    gl.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (w / h > 1) {
      gl.mesh.scale.x = gl.mesh.scale.y = 1.05 * w / h;
    }

    gl.camera.updateProjectionMatrix();
  };

  const render = () => {
    gl.renderer.render(gl.scene, gl.camera);
  };

  addScene();
  addMesh();
  update();
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = innerHeight - clientY ;
  });
};

init();