// an interface for the API with electron
export interface APIType {
  ping: () => Promise<string>
  pingData: (data: string) => Promise<string>
  rssParseUrl: (url: string) => Promise<any>
}

// grab the api injected by electron
const electronWindow = window as (typeof window & { electronAPI: any })
const API: APIType = electronWindow.electronAPI
export default API
