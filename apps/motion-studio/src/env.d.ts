/// <reference types="@motion-canvas/core/project" />
/// <reference types="vite/client" />

declare module '*?project' {
  const project: import('@motion-canvas/core').Project;
  export default project;
}
