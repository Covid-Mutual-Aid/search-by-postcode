import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import P from 'ts-prove'

import lambda, { params, responseJson$ } from '../_utility_/lib/lambdaRx'
import db from '../_utility_/database'
import { getData } from './sources/usa-localised-resources'
import { testSource } from './sources/test-sheet'

export const getExternalData = lambda((req$) => req$.pipe(switchMap(getData), responseJson$))

export const getTestData = lambda((req$) => req$.pipe(switchMap(testSource.handler), responseJson$))

const sources = [testSource]

export const triggerSource = lambda((req$) =>
  req$.pipe(
    params(P.shape({ id: P.string })),
    switchMap(async ({ id }) => {
      const source = sources.find((s) => s.external_id === id)
      if (typeof source === 'undefined') return { message: 'Invalid source' }
      const snapShot = await source.handler()
      return snapShot
    }),
    responseJson$
  )
)
