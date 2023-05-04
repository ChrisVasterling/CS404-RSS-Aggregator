// an interface for the API with electron
export interface APIType {
  ping: () => Promise<string>,
  pingData: (data: string) => Promise<string>,
  rssParseUrl: (url: string) => Promise<any>
}

// grab the api injected by electron
const API: APIType = window['electronAPI']
export default API
