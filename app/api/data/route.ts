import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
  origin: 'https://bunpro.jp', // 明确指定允许的源
  optionsSuccessStatus: 200 // 一些旧的浏览器（IE11, various SmartTVs）在 204 上卡住
})

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)

  // 明确处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const data = req.body
      console.log('Received data:', data)
      res.status(200).json({ message: 'Data received successfully' })
    } catch (error) {
      res.status(400).json({ message: 'Error processing data' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
