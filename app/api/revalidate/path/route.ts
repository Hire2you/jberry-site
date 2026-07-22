import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {
  paths?: Array<string | null>
  path?: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {
        status: 500,
      })
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // wait for Content Lake / CDN propagation
    )

    if (!isValidSignature) {
      return new Response(JSON.stringify({message: 'Invalid signature'}), {status: 401})
    }

    const paths = [
      ...(Array.isArray(body?.paths) ? body.paths : []),
      ...(body?.path ? [body.path] : []),
    ].filter((path): path is string => typeof path === 'string' && path.length > 0)

    if (!paths.length) {
      return new Response(JSON.stringify({message: 'Bad Request', body}), {status: 400})
    }

    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      message: `Revalidated paths: ${paths.join(', ')}`,
      revalidated: paths,
    })
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, {status: 500})
  }
}
