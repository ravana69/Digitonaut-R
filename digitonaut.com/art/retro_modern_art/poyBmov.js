function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const Threelium = {};

(scope => {
  class Scene extends THREE.Scene {
    constructor({
      camera,
      controls,
      ...restProps })
    {
      super();
      const {
        props: {
          children } } =

      this.initialize(restProps);
      this.entities = React.Children.map(children, child => {
        const entity = new child.type({
          camera,
          controls,
          ...child.props });

        this.add(entity);
        return entity;
      });
    }

    animate(timeDelta) {
      this.entities.forEach(entity => {
        entity.time += timeDelta;
        if (entity.update) {
          entity.update(timeDelta);
        }
      });
    }

    dispose() {
      this.entities.forEach(e => e.dispose && e.dispose());
      super.dispose();
    }}

  scope.Scene = Scene;

  class ThreeRenderer extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "setDimensions",































































      () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        if (this.camera.updateProjectionMatrix) {
          this.camera.updateProjectionMatrix();
        }
        if (this.controls && this.controls.handleResize) {
          this.controls.handleResize();
        }
      });}componentDidMount() {const { camera, controls, scene, antialias, alpha, children, outputEncoding, toneMapping, toneMappingExposure } = this.props;this.renderer = new THREE.WebGLRenderer({ antialias, alpha, canvas: this.canvas });if (outputEncoding) {this.renderer.outputEncoding = outputEncoding;}if (toneMapping) {this.renderer.toneMapping = toneMapping;}if (toneMappingExposure !== undefined) {this.renderer.toneMappingExposure = toneMappingExposure;}this.renderer.setPixelRatio(window.devicePixelRatio);React.Children.forEach(children, child => {new child.type({ renderer: this.renderer, ...child.props });});this.camera = new camera.type({ aspect: 0, ...camera.props });if (controls) {this.controls = new controls.type({ camera: this.camera, domElement: this.renderer.domElement, ...controls.props });}this.scene = new scene.type({ camera: this.camera, controls: this.controls, renderer: this.renderer, ...scene.props });window.addEventListener('resize', this.setDimensions);this.setDimensions();setTimeout(() => {this.lastRenderTime = +new Date();this.animate();}, 0);}

    shouldComponentUpdate() {
      return false;
    }

    animate() {
      const currentTime = +new Date();
      this.timeDelta = (currentTime - this.lastRenderTime) / 1000;
      this.lastRenderTime = currentTime;
      if (this.controls && this.controls.update) {
        this.controls.update(this.timeDelta);
      }
      this.scene.animate(this.timeDelta);
      this.renderer.render(this.scene, this.camera);
      this.reqFrameId = requestAnimationFrame(() => {
        this.animate();
      });
    }

    componentWillUnmount() {
      cancelAnimationFrame(this.reqFrameId);
      this.scene.dispose();
      this.controls.dispose();
      this.renderer.dispose();
    }

    render() {
      return /*#__PURE__*/(
        React.createElement("canvas", {
          ref: c => this.canvas = c,
          className: this.props.className }));


    }}_defineProperty(ThreeRenderer, "defaultProps", { antialias: false, alpha: false });

  scope.Renderer = ThreeRenderer;

  const SceneView = ({
    scene,
    camera,
    controls,
    children,
    renderer,
    outputEncoding,
    toneMapping,
    toneMappingExposure,
    antialias,
    alpha }) => /*#__PURE__*/

  React.createElement(ThreeRenderer, _extends({
    className: "c-react-canvas",
    scene: children },
  {
    antialias,
    alpha,
    camera,
    controls,
    outputEncoding,
    toneMapping,
    toneMappingExposure }));



  scope.SceneView = SceneView;

  class OrbitControls extends THREE.OrbitControls {
    constructor({
      minDistance = 0,
      enablePan = true,
      enableZoom = true,
      enableRotate = true,
      camera,
      domElement,
      enabled = true,
      mouseButtons = null,
      minPolarAngle = 0,
      maxPolarAngle = Math.PI,
      maxDistance = Infinity })
    {
      super(
      camera,
      domElement);

      this.minDistance = minDistance;
      this.enablePan = enablePan;
      this.enableZoom = enableZoom;
      this.enableRotate = enableRotate;
      this.enabled = enabled;
      this.minPolarAngle = minPolarAngle;
      this.maxPolarAngle = maxPolarAngle;
      this.maxDistance = maxDistance;
      if (mouseButtons) {
        this.mouseButtons = mouseButtons;
      }
    }}

  scope.OrbitControls = OrbitControls;

  class Camera extends THREE.Camera {
    constructor({
      position })
    {
      super();
      this.position.copy(position);
    }}

  scope.Camera = Camera;


  class PerspectiveCamera extends THREE.PerspectiveCamera {





    constructor({
      position,
      fov,
      aspect,
      near,
      far })
    {
      super(
      fov,
      aspect,
      near,
      far);

      this.position.copy(position);
    }}_defineProperty(PerspectiveCamera, "defaultProps", { position: new THREE.Vector3(0, 0, 0), aspect: window.innerWidth / window.innerHeight });

  scope.PerspectiveCamera = PerspectiveCamera;

  class EnhancedMaterial extends BAS.PhongAnimationMaterial {
    constructor({
      flatShading = true,
      side = THREE.FrontSide,
      uniforms = {},
      uniformValues = {},
      vertexParameters = [],
      varyingParameters = [],
      vertexFunctions = [],
      vertexInit = [],
      vertexNormal = [],
      vertexPosition = [],
      fragmentParameters = [],
      fragmentFunctions = [],
      fragmentInit = [],
      fragmentDiffuse = [],
      fragmentMap = [],
      fragmentEmissive = [],
      fragmentSpecular = [],
      ...rest })
    {
      super({
        flatShading,
        side,
        uniforms,
        uniformValues,
        vertexParameters: [
        '// vertexParameters',
        ...vertexParameters],

        varyingParameters: [
        '// varyingParameters',
        ...varyingParameters],

        vertexFunctions: [
        '// vertexFunctions',
        ...vertexFunctions],

        vertexInit: [
        '// vertexInit',
        ...vertexInit],

        vertexNormal: [
        '// vertexNormal',
        ...vertexNormal],

        vertexPosition: [
        '// vertexPosition',
        ...vertexPosition],

        fragmentParameters: [
        '// fragmentParameters',
        ...fragmentParameters],

        fragmentFunctions: [
        '// fragmentFunctions',
        ...fragmentFunctions],

        fragmentInit: [
        '// fragmentInit',
        ...fragmentInit],

        fragmentDiffuse: [
        '// fragmentDiffuse',
        ...fragmentDiffuse],

        fragmentMap: [
        '// fragmentMap',
        ...fragmentMap],

        fragmentEmissive: [
        '// fragmentEmissive',
        ...fragmentEmissive],

        fragmentSpecular: [
        '// fragmentSpecular',
        ...fragmentSpecular],

        ...rest });

    }}

  scope.EnhancedMaterial = EnhancedMaterial;

  const loadTexture = url => new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
    url,
    texture => resolve(texture),
    () => {},
    () => reject(new Error(`Failed to load texture by url '${url}'`)));

  });
  scope.loadTexture = loadTexture;

  class DirectionalLight extends THREE.DirectionalLight {
    constructor({
      color,
      intensity,
      position,
      castShadow = false,
      shadowFrustumSize,
      shadowNear,
      shadowFar,
      shadowHelper = false,
      scene })
    {
      super(color, intensity);
      this.defaultPosition = this.calculateLightPosition(
      position,
      castShadow,
      shadowNear,
      shadowFar);

      this.position.copy(this.defaultPosition);
      this.castShadow = castShadow;
      if (this.castShadow) {
        this.shadow.camera = new THREE.OrthographicCamera(
        -shadowFrustumSize / 2,
        shadowFrustumSize / 2,
        shadowFrustumSize / 2,
        -shadowFrustumSize / 2,
        shadowNear,
        shadowFar);

        this.shadow.bias = 0.0001;
        this.shadow.mapSize.width = this.shadow.mapSize.height = 1024;
        if (shadowHelper) {
          const shadowHelper = new THREE.CameraHelper(this.shadow.camera);
          scene.add(shadowHelper);
        }
      }
    }

    calculateLightPosition(
    sunPosition,
    hasShadow,
    shadowNear,
    shadowFar)
    {
      const position = sunPosition.clone().normalize();
      if (hasShadow) {
        return position.multiplyScalar(shadowFar / 2 + shadowNear);
      }
      return position;
    }}

  Threelium.DirectionalLight = DirectionalLight;

  class CameraLight extends DirectionalLight {
    constructor({
      camera,
      ...rest })
    {
      super({
        ...rest });

      this.camera = camera;
    }

    update() {
      const cameraQuaternion = this.camera.quaternion;
      this.position.copy(this.defaultPosition.clone().applyQuaternion(cameraQuaternion));
    }}

  Threelium.CameraLight = CameraLight;

  class AmbientLight extends THREE.AmbientLight {
    constructor({
      color })
    {
      super(color);
    }}

  Threelium.AmbientLight = AmbientLight;
})(Threelium);