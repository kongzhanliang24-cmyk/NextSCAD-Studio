const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default basePath

export function assetUrl(path) {
  return `${basePath}${path}`
}
