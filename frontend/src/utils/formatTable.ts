import { isObject } from '@/utils/utils'

// columns

export function formatColumns(columns, preset_name = 'events',) {
  if (!isObject(columns)) return {}
  
  for (const [k, v] of Object.entries(columns)) {
    
    if (preset_name == 'events') {
      switch (k) {
        case 'id':
          v.class = 'w-14'
          break
        case 'doc_type':
          v.class = 'w-24'
          break
        case 'doc_date':
          v.class = 'w-10'
          break
        case 'created_at':
          v.class = 'w-4'
          break
        case 'author':
          v.class = 'w-4'
            break
        case 'comment':
          v.class = 'w-96'
          break
        case 'currency':
          v.class = 'w-96'
          break
        case 'is_posted':
          v.class = 'w-10'
          break
        case 'total_amount':
          v.class = ''
          break
        default:
          v.class = 'w-20'
      }
      
      if (['id'].includes(k)) v.gridSize = 'minmax(8rem, 20rem)'
      if (['scheduled_time', 'start_time', 'end_time'].includes(k)) v.gridSize = '8.5rem'
      if (k.includes('_id')) v.gridSize = '5rem'

      
      //if (!v.gridSize) console.log(k)
      
      continue
    }
    
    //
  }
  
  return columns
}