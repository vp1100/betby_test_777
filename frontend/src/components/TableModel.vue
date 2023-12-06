<script lang="ts">
  import { RecycleScroller } from 'vue-virtual-scroller'
  import { format, parseISO, isValid } from 'date-fns'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  
  export default {
    components: {
      RecycleScroller,
    },
    
    props: [
      'columns',
      'rows',
      'searchQuery',
      'sort',
      'order',
    ],
    
    emits: [
      'rowsTotalFiltered',
      'setSort',
    ],
    
    data() {
      return {
        columnLength: 0,
      }
    },
    
    computed: {
      getFilteredRows() {
        if (!this.searchQuery) return this.rows
        
        const rowsFiltered = []
        
        for (const row of this.rows) {
          for (let row_value of Object.values(row)) {
            if (!row_value) continue
            row_value = String(row_value).toLowerCase()
            
            if (String(row_value).includes(this.searchQuery.toLowerCase())) {
              rowsFiltered.push(row)
              break
            }
          }
        }
        
        this.$emit('rowsTotalFiltered', rowsFiltered.length)
        
        return rowsFiltered
      },
    },
    
    mounted() {
      if (this.columns && this.rows) {
        this.columnLength = Object.keys(this.columns).length
      } else {
        console.log('no columns')
      }
    },
    
    methods: {
      getCellClass(columnName, columnProp) {
        if (!columnName || !columnProp) return ''
        const style = []
        
        style[style.length] = (columnProp.type == 'integer' || columnProp.type == 'number') ? ' text-right' : ''
        
        if (columnProp.format == 'date' || columnProp.format == 'date-time') {
          style[style.length] = "text-center !whitespace-nowrap !px-0.5"
        }
        
        return style
      },
      
      formatCell(value, columnProp) {
        if (columnProp.format == 'date'){
          const date_parse = parseISO(value)
          if (isValid(date_parse)) value = format(date_parse, 'dd.MM.yyyy')
        }
        
        if (columnProp.format == 'date-time'){
          const date_parse = parseISO(value)
          if (isValid(date_parse)) value = format(date_parse, 'dd.MM.yyyy в HH:mm')
        }
        
        if (columnProp.type == 'boolean'){
          value = value ? 'Да' : 'Нет'
        }
        
        return value
      },
      
      getGridTemplate() {
        const cols = []
        const def = "minmax(0, 3fr)"
        for (const column of Object.values(this.columns)) {
          cols.push(column.gridSize || def)
        }
        
        return cols.join(' ')
      },
      
      setSort(sort) {
        if (this.sort == sort && this.order == 'desc' ) {
          this.$emit('setSort', null, null)
        } else {
          this.$emit('setSort', sort, (this.sort == sort) ? 'desc' : 'asc')
        }
      }
      
      //
    },
    
  }
</script>

<template>
  <template v-if="rows">
    <div
      ref="table"
      class="bg-white w-fit outline-none shadow-md border border-b-0 border-t-0 border-gray-400 table-model"
      tabindex="-1"
    >
      <div class="grid text-center border-b border-gray-400 divide-x divide-gray-400 select-none" :style="'grid-template-columns: '+getGridTemplate()">
        <template v-for="column, key in columns" :key="key">
          <div class="p-0.5 bg-zinc-300 font-semibold" :class="(sort == key) ? 'underline' : ''" @click="setSort(key)">
            {{ column.title }} {{ (sort == key) ? ((order == 'desc') ? '+' : '-' ) : '' }}
          </div>
        </template>
      </div>

      <RecycleScroller
        ref="scroller"
        class="scroller w-full"
        :items="getFilteredRows"
        :item-size="30"
        key-field="id"
        page-mode
        list-class="-border border-gray-400"
        :emit-update="false"
      >
        <template #default="{ item }">
          <div :id="item.id" :class="['h-[30px] grid divide-x divide-y divide-y-reverse divide-gray-300 table-row']" :style="'grid-template-columns: '+getGridTemplate()">
            <template v-for="(columnProp, columnName) in columns" :key="columnName">
              <div :class="['truncate overflow-hidden whitespace-nowrap', 'border-b border-gray-300 p-1', getCellClass(columnName, columnProp)]">
                {{ formatCell(item[columnName], columnProp) }}
              </div>
            </template>
          </div>
        </template>
      </RecycleScroller>
      
      <template v-if="!rows || !rows.length">
        <slot name="empty" />
      </template>
    </div>
  </template>
  
  <template v-else>
    <div class="m-10">
      No columns
    </div>
  </template>
</template>