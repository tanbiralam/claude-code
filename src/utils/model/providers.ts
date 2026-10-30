import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'

export type APIProvider =
  | 'firstParty'
  | 'bedrock'
  | 'vertex'
  | 'foundry'
  | 'minimax'

const MINI_MAX_ANTHROPIC_HOSTS = new Set(['api.minimax.io', 'api.minimaxi.com'])

export const MINIMAX_FLASH_MODEL = 'MiniMax-M3.1-Flash'
export const MINIMAX_M3_MODEL = 'MiniMax-M3'

function getAnthropicBaseUrlHost(): string | null {
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) {
    return null
  }
  try {
    return new URL(baseUrl).host
  } catch {
    return null
  }
}

export function isMiniMaxAnthropicBaseUrl(): boolean {
  const host = getAnthropicBaseUrlHost()
  return host !== null && MINI_MAX_ANTHROPIC_HOSTS.has(host)
}

export function getAPIProvider(): APIProvider {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return 'bedrock'
  }
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return 'vertex'
  }
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return 'foundry'
  }
  if (isMiniMaxAnthropicBaseUrl()) {
    return 'minimax'
  }
  return 'firstParty'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 * Returns true if not set (default API) or points to api.anthropic.com
 * (or api-staging.anthropic.com for ant users).
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) {
    return true
  }
  const host = getAnthropicBaseUrlHost()
  if (!host) {
    return false
  }
  const allowedHosts = ['api.anthropic.com']
  if (process.env.USER_TYPE === 'ant') {
    allowedHosts.push('api-staging.anthropic.com')
  }
  return allowedHosts.includes(host)
}
