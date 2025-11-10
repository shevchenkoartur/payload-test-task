import type { Payload } from 'payload'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

let cached: Payload | null = null
export const getPayloadClient = async () => {
  if (cached) return cached
  cached = await getPayload({ config: payloadConfig })
  return cached
}
