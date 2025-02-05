export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-27'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "sk9Oo3dqeDmYcBP3rxJqYQIUFG7dJgj2BWyYTvcnelcCWjeSKFz8kAYqIuIU0Fy7oiYnbjJvz2JU3j8jW1ayfFtSlvZSRN49P2zRz37GHpVt0HP05pH91xxK8Wh010PakcxqLRrX5CVY4XjMA3iyGtr0rhbg4B7oXXJ2hPTZXaZGKxwcKGKm",
  'Missing environment variable: SANITY_API_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
