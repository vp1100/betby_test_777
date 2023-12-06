import { endOfMonth, startOfMonth, startOfYear, subMonths, subYears, startOfDay, endOfDay } from 'date-fns'

export function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null
}

export const periodToday = [startOfMonth(startOfDay(new Date())), endOfDay(new Date())]

export const defaultPresetRanges = [
  {label: 'Сегодня', range: [new Date(), new Date()]},
  {label: 'Этот месяц', range: [startOfMonth(new Date()), endOfMonth(new Date())]},
  {label: 'Этот и прошлый месяц', range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(new Date())]},
  {label: 'Прошлый месяц', range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]},
  {label: 'С начала года', range: [startOfYear(new Date()), endOfMonth(new Date())]},
  {label: 'За 3 года', range: [startOfYear(subYears(new Date(),2)), endOfMonth(new Date())]},
]