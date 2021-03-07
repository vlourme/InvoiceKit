/**
 * URL to Data URI
 *
 * @param { string } URL
 * @returns Promise<string>
 */
export default async (url: string): Promise<string> => {
  const blob = await fetch(url, { method: 'GET' }).then((r) => r.blob())

  return await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = function () {
      resolve(reader.result as string)
    }

    reader.readAsDataURL(blob)
  })
}
