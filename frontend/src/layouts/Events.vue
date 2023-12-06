<script lang="ts">
  import http from '@/plugins/http'
  import { formatColumns } from '@/utils/formatTable'
  import { defaultPresetRanges, periodToday } from '@/utils/utils'
  
  import TableModel from '@/components/TableModel.vue' 
  
  export default {
    components: {
      TableModel,
    },
    
    created() {
      this.getTable()
    },
    
    data() {
      return {
        status: '',
        title: "Events table",
        base_url: '/events',
        
        sort: null,
        order: null,
        
        columns: [],
        columnsLoaded: false,
        
        rows: [],
        rowsLoaded: false,
        
        rowsTotal: 0,
        rowsTotalLoaded: 0,
        rowsRequestLimit: 10,
        rowsLoadingNow: false,
        rowsTotalFiltered: 0,
        
        searchQuery: null,
        
        datePeriod: periodToday,
        presetRanges: defaultPresetRanges,
      }
    },
    
    methods: {
      async getTableSchema() {
        const {d, msg} = await http(this.base_url+'/schema')
        if (!d?.data) return this.status = msg
        
        this.columns = formatColumns(d.data.table.properties)
        this.columnsLoaded = true
      },
      
      async getTableDataMore() {
        if (this.rowsTotalLoaded >= this.rowsTotal) return this.rowsLoadingNow = false
        await new Promise(r => setTimeout(r, 50)) // slow down to show loading process
        
        const {d, msg} = await http({
          url: this.base_url,
          params: {
            start_date: this.datePeriod?.[0],
            end_date: this.datePeriod?.[1],
            skip: this.rowsTotalLoaded,
            limit: this.rowsRequestLimit,
            sort: this.sort,
            order: this.order,
          },
        })
        
        if (!d?.data) return this.status = msg
        if (d.data?.length == 0) return
        
        for (const [i, r] of d.data.entries()) {
          Object.assign(this.rows[(this.rowsTotalLoaded + i)], r)
        }
        
        this.rowsTotalLoaded = this.rowsTotalLoaded + d.data.length
        this.rowsTotal = d.total
        
        this.getTableDataMore()
      },
      
      async getTableData() {
        if (this.rowsLoadingNow) return
        this.rowsLoadingNow = true
        
        const {d, msg} = await http({
          url: this.base_url,
          params: {
            start_date: this.datePeriod?.[0],
            end_date: this.datePeriod?.[1],
            skip: 0,
            limit: this.rowsRequestLimit,
            sort: this.sort,
            order: this.order,
          },
        })
        if (!d?.data) return this.status = msg
        
        if (this.rows.length != d.total) {
          this.rows = []
          for (let step = 0; step < d.total; step++) {
            this.rows.push({ id: step + 1 })
          }
        }
        
        for (const [i, r] of d.data.entries()) {
          Object.assign(this.rows[i], r)
        }
        
        this.rowsLoaded = true
        this.rowsTotalLoaded = d.data.length
        this.rowsTotal = d.total
        
        this.getTableDataMore()
      },
      
      async getTable() {
        if (!this.columnsLoaded) await this.getTableSchema()
        this.getTableData()
      },
      
      async onDateUpdate() {
        this.rowsLoadingNow = false
        await new Promise(r => setTimeout(r, 50))
        this.getTable()
      },
      
      setSort(sort, order) {
        this.sort = sort
        this.order = order
        this.getTable()
      }
    },
    
    // end
  }
</script>

<template>
  <div class=" px-4 pb-3 py-2 border-b border-gray-400 flex justify-between">
    <div class="text-xl font-light">{{ title }}</div>
    <div class="flex gap-2 text-sm">
      
      <div class="flex items-center gap-4 mr-4">
        <div v-if="rowsTotal != rowsTotalLoaded" class="text-sm text-gray-600">
          Загрузка записей: {{ Math.round(rowsTotalLoaded / rowsTotal * 100) }}%
        </div>
        
        <div v-show="searchQuery" class="text-sm text-gray-600">
          Найдено: {{ rowsTotalFiltered }}
        </div>
        <div v-show="rowsTotal" class="text-sm text-gray-600 ">
          Всего записей: {{ rowsTotal }}
        </div>
      </div>
      
      <div class="w-[320px] mr-1.5">
        <VueDatePicker
          v-model="datePeriod"
          type="datetime"
          time-picker-inline
          range
          auto-apply
          placeholder="Выберите период"
          :enable-time-picker="true"
          :month-change-on-scroll="false"
          format="dd.MM.yy HH:mm"
          locale="ru"
          :preset-ranges="presetRanges"
          @update:model-value="onDateUpdate()"
        />
      </div>
      
      <input v-model="searchQuery" placeholder="Поиск" class="w-60 h-[38px] border p-2 px-4 border-gray-300 rounded-md outline-none focus:border-blue-700" />
    </div>
  </div>
  <div v-if="columnsLoaded">
    
    <TableModel
      class="w-full text-sm"
      :search-query="searchQuery"
      :columns="columns"
      :rows="rows"
      :sort="sort"
      :order="order"
      @rows-total-filtered="rowsTotalFiltered = $event"
      @set-sort="setSort"
    > 
      <template #empty>
        <div class="p-4 pl-14 text-gray-800">
          <span>{{ status || "Rows not found" }}</span>
        </div>
      </template>
    </TableModel>
    
  </div>
  <div v-else class="p-10 text-center font-bold">
    {{ status }}
  </div>
</template>