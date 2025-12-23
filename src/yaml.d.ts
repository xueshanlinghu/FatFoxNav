declare module '*.yaml' {
  const data: any
  export default data
}

declare module '@data/*.yaml' {
  const data: any
  export default data
}
