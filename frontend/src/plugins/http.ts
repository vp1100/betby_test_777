import axios from 'axios'

// axios instance

console.log(import.meta.env.VITE_API_URL)

const protocol = import.meta.env.VITE_USE_HTTPS === 'true' ? 'https://' : 'http://'
const url = protocol+location.hostname+import.meta.env.VITE_API_URL

const instance = axios.create({
  withCredentials: true,
  baseURL: url,
  timeout: import.meta.env.VITE_API_TIMEOUT_MS,
})

// messages

function formatError(event) {
  let response = event
  //console.log(response)
  
  if (Array.isArray(event)) {
    const arr = []
    
    for (const e of event) {
      let msg = e.loc+': '+e.msg
      
      if (e.type == 'assertion_error') {
        if (e.loc.length == 1) {
          msg = `${e.loc[0]} не может быть 0`
        }
        
        if (e.loc.length == 3) {
          msg = `${e.loc[2]} в строке ${e.loc[1]+1} не может быть 0`
        }
      }
      
      if (e.type == 'missing' || e.type == 'greater_than') {
        if (e.loc.length == 1) {
          msg = `не указан ${e.loc[0]}`
        }
        
        if (e.loc.length == 3) {
          msg = `не указан ${e.loc[2]} в строке ${e.loc[1]+1}`
        }
      }
      
      if (e.type == 'model_type') {
        msg = `неверный формат ${e.loc[0]}`
      }
      
      arr.push(msg)
    }
    
    response = arr.join(' \n')
  }
  
  return response
}

export default async function http(options) {
  
  const errorRetryCount = 2
  let timeout = 1000
  const timeoutOffset = 1000
  let n = 0
  
  let d
  let e
  let r
  let msg = ''
  
  while (n < errorRetryCount) {
    if (n > 0) {
      console.log('try: '+n+' ,timeout: '+timeout)
      await new Promise(r => setTimeout(r, timeout))
      timeout += timeoutOffset
    }
    
    n++
    
    await instance(options).then(response => r = response).catch(error => e = error)
    
    if (e) {
      msg = "Ошибка сети (Error: "+e.message+")"
      
      if (e.code == 'ERR_NETWORK') continue
      
      if (e.response) {
        msg = e.response.statusText
        
        if (e.response.status == 401) {
          msg = "Требуется авторизация (Error: "+e.response.statusText+")"
        }
        
        if (e.response.status == 404) {
          msg = "Не найдено (Error: "+e.response.statusText+")"
        }
        
        if (e.response.data) {
          console.log(e.response.data)
          
          msg = formatError(e.response.data.detail) || e.response.data.status
          //console.log(e.response.data.detail)
        }
        
      }
    }
    
    if (r) {
      if (r.status == 200){
        //msg = r.data.detail || r.data.status
        msg = r.data.status
        
        if (r.data.status == 'success') {
          d = r.data
          //console.log(d)
        } else {
          e = r.data
        }
      }
    }
    
    
    break
  }
  
  
  
  return {d, e, r, msg}
}