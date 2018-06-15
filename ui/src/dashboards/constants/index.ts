import {
  DEFAULT_VERTICAL_TIME_AXIS,
  DEFAULT_FIX_FIRST_COLUMN,
} from 'src/shared/constants/tableGraph'
import {Cell, QueryConfig} from 'src/types'
import {CellType, Dashboard, NumberFormat} from 'src/types/dashboard'
import {TimeRange} from 'src/types/query'
import {TEMP_VAR_DASHBOARD_TIME} from 'src/shared/constants'

export const UNTITLED_GRAPH: string = 'Untitled Graph'

export const TIME_FORMAT_TOOLTIP_LINK: string =
  'http://momentjs.com/docs/#/parsing/string-format/'

export interface TimeField {
  internalName: string
  displayName: string
  visible: boolean
}
export const DEFAULT_TIME_FIELD: TimeField = {
  internalName: 'time',
  displayName: '',
  visible: true,
}

export const DEFAULT_TABLE_OPTIONS = {
  verticalTimeAxis: DEFAULT_VERTICAL_TIME_AXIS,
  sortBy: DEFAULT_TIME_FIELD,
  wrapping: 'truncate',
  fixFirstColumn: DEFAULT_FIX_FIRST_COLUMN,
}

export const DEFAULT_TIME_FORMAT: string = 'MM/DD/YYYY HH:mm:ss'
export const TIME_FORMAT_CUSTOM: string = 'Custom'

export const FORMAT_OPTIONS: Array<{text: string}> = [
  {text: DEFAULT_TIME_FORMAT},
  {text: 'MM/DD/YYYY HH:mm:ss.SSS'},
  {text: 'YYYY-MM-DD HH:mm:ss'},
  {text: 'HH:mm:ss'},
  {text: 'HH:mm:ss.SSS'},
  {text: 'MMMM D, YYYY HH:mm:ss'},
  {text: 'dddd, MMMM D, YYYY HH:mm:ss'},
  {text: TIME_FORMAT_CUSTOM},
]

const DEFAULT_NUMBER_FORMAT: NumberFormat = {
  thousands: {
    separator: '',
    digits: '',
  },
  decimals: {
    separator: '',
    digits: '',
  },
}

export type NewDefaultCell = Pick<
  Cell,
  Exclude<keyof Cell, 'i' | 'axes' | 'colors' | 'links' | 'legend'>
>
export const NEW_DEFAULT_DASHBOARD_CELL: NewDefaultCell = {
  x: 0,
  y: 0,
  w: 4,
  h: 4,
  name: UNTITLED_GRAPH,
  type: CellType.Line,
  queries: [],
  tableOptions: DEFAULT_TABLE_OPTIONS,
  timeFormat: DEFAULT_TIME_FORMAT,
  numberFormat: DEFAULT_NUMBER_FORMAT,
  fieldOptions: [DEFAULT_TIME_FIELD],
}

interface EmptyDefaultDashboardCell {
  x: number
  y: number
  queries: QueryConfig[]
  name: string
  type: CellType
}
type EmptyDefaultDashboard = Pick<
  Dashboard,
  Exclude<keyof Dashboard, 'templates' | 'links' | 'organization' | 'cells'>
> & {
  cells: EmptyDefaultDashboardCell[]
}
export const EMPTY_DASHBOARD: EmptyDefaultDashboard = {
  id: 0,
  name: '',
  cells: [
    {
      x: 0,
      y: 0,
      queries: [],
      name: 'Loading...',
      type: CellType.Line,
    },
  ],
}

type NewDefaultDashboard = Pick<
  Dashboard,
  Exclude<keyof Dashboard, 'id' | 'templates' | 'organization' | 'cells'> & {
    cells: NewDefaultCell[]
  }
>
export const DEFAULT_DASHBOARD_NAME = 'Name This Dashboard'
export const NEW_DASHBOARD: NewDefaultDashboard = {
  name: DEFAULT_DASHBOARD_NAME,
  cells: [NEW_DEFAULT_DASHBOARD_CELL],
}

export const TEMPLATE_TYPES = [
  {
    text: 'CSV',
    type: 'csv',
  },
  {
    text: 'Databases',
    type: 'databases',
  },
  {
    text: 'Measurements',
    type: 'measurements',
  },
  {
    text: 'Field Keys',
    type: 'fieldKeys',
  },
  {
    text: 'Tag Keys',
    type: 'tagKeys',
  },
  {
    text: 'Tag Values',
    type: 'tagValues',
  },
]

export const TEMPLATE_VARIABLE_TYPES = {
  csv: 'csv',
  databases: 'database',
  measurements: 'measurement',
  fieldKeys: 'fieldKey',
  tagKeys: 'tagKey',
  tagValues: 'tagValue',
}

interface TemplateVariableQueries {
  databases: string
  measurements: string
  fieldKeys: string
  tagKeys: string
  tagValues: string
}

export const TEMPLATE_VARIABLE_QUERIES: TemplateVariableQueries = {
  databases: 'SHOW DATABASES',
  measurements: 'SHOW MEASUREMENTS ON :database:',
  fieldKeys: 'SHOW FIELD KEYS ON :database: FROM :measurement:',
  tagKeys: 'SHOW TAG KEYS ON :database: FROM :measurement:',
  tagValues:
    'SHOW TAG VALUES ON :database: FROM :measurement: WITH KEY=:tagKey:',
}

export const MATCH_INCOMPLETE_TEMPLATES = /:[\w-]*/g

export const applyMasks = query => {
  const matchWholeTemplates = /:([\w-]*):/g
  const maskForWholeTemplates = '😸$1😸'
  return query.replace(matchWholeTemplates, maskForWholeTemplates)
}
export const insertTempVar = (query, tempVar) => {
  return query.replace(MATCH_INCOMPLETE_TEMPLATES, tempVar)
}
export const unMask = query => {
  return query.replace(/😸/g, ':')
}
export const removeUnselectedTemplateValues = templates => {
  return templates.map(template => {
    const selectedValues = template.values.filter(value => value.selected)
    return {...template, values: selectedValues}
  })
}

export const TYPE_QUERY_CONFIG: string = 'queryConfig'
export const TYPE_SHIFTED: string = 'shifted queryConfig'
export const TYPE_FLUX: string = 'flux'
export const DASHBOARD_NAME_MAX_LENGTH: number = 50
export const TEMPLATE_RANGE: TimeRange = {
  upper: null,
  lower: TEMP_VAR_DASHBOARD_TIME,
}
