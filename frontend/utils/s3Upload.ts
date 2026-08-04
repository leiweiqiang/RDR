import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { UploadCredentialResponse } from '~/types/api/upload'
import type { ResourceType } from '~/types/api/upload'
import { getUploadCredentials } from '~/api/uploads'

export type S3UploadResult = {
  key: string
  s3Uri: string
  publicUrl: string
  bucket: string
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-()+ ]+/g, '_').replace(/\s+/g, '_')
}

function buildPublicUrl(bucket: string, region: string, key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export async function uploadFileWithCredentials(
  file: File | Blob,
  fileName: string,
  resourceType: ResourceType,
  onProgress?: (percent: number) => void,
): Promise<S3UploadResult> {
  const creds: UploadCredentialResponse = await getUploadCredentials({
    resource_type: resourceType,
  })

  const key = `${creds.upload_prefix}${sanitizeFileName(fileName)}`
  const contentType =
    file instanceof File && file.type
      ? file.type
      : resourceType === 'cover'
        ? 'image/jpeg'
        : 'application/octet-stream'

  const client = new S3Client({
    region: creds.region,
    credentials: {
      accessKeyId: creds.access_key_id,
      secretAccessKey: creds.secret_access_key,
      sessionToken: creds.session_token,
    },
    // Browser multipart uploads fail when the SDK defaults to CRC32: CreateMultipartUpload
    // records crc32, but UploadPart response checksum headers are often blocked by CORS
    // (ExposeHeaders), so CompleteMultipartUpload is missing per-part checksums.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })

  const upload = new Upload({
    client,
    params: {
      Bucket: creds.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    },
  })

  upload.on('httpUploadProgress', (progress) => {
    if (!onProgress || !progress.total) return
    onProgress(Math.round(((progress.loaded ?? 0) / progress.total) * 100))
  })

  await upload.done()

  return {
    key,
    s3Uri: `s3://${creds.bucket}/${key}`,
    publicUrl: buildPublicUrl(creds.bucket, creds.region, key),
    bucket: creds.bucket,
  }
}
