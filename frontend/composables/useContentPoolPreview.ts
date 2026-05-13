import nba1Url from '~/assets/nba1.png?url'
import nba2Url from '~/assets/nba2.png?url'
import nba3Url from '~/assets/nba3.png?url'

const previewByPoolId: Record<string, string> = {
  'pool-1': nba1Url,
  'pool-2': nba2Url,
  'pool-3': nba3Url,
}

export function useContentPoolPreview(poolId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(poolId))
  const previewImageUrl = computed(() => previewByPoolId[id.value] ?? nba1Url)
  return { previewImageUrl }
}
