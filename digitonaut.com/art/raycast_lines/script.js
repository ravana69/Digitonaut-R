// Made with TroisJS : https://github.com/troisjs/trois
import { createApp } from 'https://unpkg.com/troisjs@0.1.10/build/trois.module.cdn.min.js';
import { Object3D, MathUtils, Vector3 } from 'https://unpkg.com/three@0.125.2/build/three.module.js';
const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;

createApp({
  setup() {
    const NUM_INSTANCES = 2000;
    const instances = [];
    const target = new Vector3();
    const dummyO = new Object3D();
    const dummyV = new Vector3();

    for (let i = 0; i < NUM_INSTANCES; i++) {
      instances.push({
        position: new Vector3(rndFS(200), rndFS(200), rndFS(200)),
        scale: rnd(0.2, 1),
        scaleZ: rnd(0.1, 1),
        velocity: new Vector3(rndFS(2), rndFS(2), rndFS(2)),
        attraction: 0.03 + rnd(-0.01, 0.01),
        vlimit: 1.2 + rnd(-0.1, 0.1),
      });
    }

    return {
      NUM_INSTANCES,
      instances,
      target,
      dummyO,
      dummyV,
    };
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.imesh = this.$refs.imesh.mesh;
    this.light = this.$refs.light.light;
    this.init();
  },
  methods: {
    init() {
      // init instanced mesh matrix
      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, scaleZ } = this.instances[i];
        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;

      // animate
      this.renderer.onBeforeRender(this.animate);
    },
    animate() {
      this.target.copy(this.renderer.three.mouseV3);
      this.light.position.copy(this.target);

      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, scaleZ, velocity, attraction, vlimit } = this.instances[i];

        this.dummyV.copy(this.target).sub(position).normalize().multiplyScalar(attraction);
        velocity.add(this.dummyV).clampScalar(-vlimit, vlimit);
        position.add(velocity);

        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.lookAt(this.dummyV.copy(position).add(velocity));
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;
    },
  },
}).mount('#app');