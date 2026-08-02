import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'

export type APIProvider = 'firstParty' | 'bedrock' | 'vertex' | 'foundry' | 'minimax'

const MINI_MAX_ANTHROPIC_HOSTS = new Set(['api.minimax.io', 'api.minimaxi.com'])

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

export function getAPIProvider(): APIProvider {
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)
    ? 'bedrock'
    : isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)
      ? 'vertex'
      : isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)
        ? 'foundry'
        : 'firstParty'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

export function isMiniMaxAnthropicBaseUrl(): boolean {
  const host = getAnthropicBaseUrlHost()
  return host !== null && MINI_MAX_ANTHROPIC_HOSTS.has(host)
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 * Returns true if not set (default API) or points to api.anthropic.com
 * (or api-staging.anthropic.com for ant users).
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  const host = getAnthropicBaseUrlHost()
  if (!host) {
    return true
  }
  const allowedHosts = ['api.anthropic.com', ...MINI_MAX_ANTHROPIC_HOSTS]
  if (process.env.USER_TYPE === 'ant') {
    allowedHosts.push('api-staging.anthropic.com')
  }
  return allowedHosts.includes(host)
}
