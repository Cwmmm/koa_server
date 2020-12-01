import puppeteer from 'puppeteer'
import initPup from '../init/initPup'


export async function getImgUrl(chapterId) {
  const baseUrl = "https://www.kuaikanmanhua.com/web/comic"
  const browser = await initPup()

  const page = await browser.newPage();
  //屏蔽请求类型
  await page.setRequestInterception(true);
  const blockedResourceTypes = ['image','media','font','texttrack','object','beacon','csp_report','imageset'];
  page.on('request', async req => {
    const type = req.resourceType
    if (blockedResourceTypes.includes(type)) {
      req.abort()
    } else {
      req.continue()
    }
  })
  await page.goto(`${baseUrl}/${chapterId}`,{waitUntil: 'load'});
  const res = await page.evaluate(() => {
    const imgUrlList = []
    const imgNode = document.querySelectorAll("div.imgList > img")
    imgNode.forEach((ele) => {
      imgUrlList.push(ele.dataset.src)
    })
    return imgUrlList
  })
  await page.close()
  return res
}