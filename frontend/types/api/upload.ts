export type ResourceType = 'cover' | 'raw_video'

export type UploadCredentialRequest = {
  resource_type: ResourceType
}

export type UploadCredentialResponse = {
  access_key_id: string
  secret_access_key: string
  session_token: string
  expiration: string
  region: string
  bucket: string
  upload_prefix: string
}
