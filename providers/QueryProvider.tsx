'use client'

import React from 'react'
import { createQueryProvider } from '@/lib/react-query'

const QueryProvider = createQueryProvider(React)

export { QueryProvider }
export default QueryProvider