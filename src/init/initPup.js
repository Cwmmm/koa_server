import puppeteer from 'puppeteer'


let instance = null;
export default async function initPup() {
  if(!instance){
    instance = await puppeteer.launch({
      args: [
        '--no-sandbox',                    // 沙盒模式
        '--disable-setuid-sandbox',        // uid沙盒
        '--disable-dev-shm-usage',         // 创建临时文件共享内存
        '--disable-accelerated-2d-canvas', // canvas渲染
        '--disable-gpu']                  // GPU硬件加速
    });
  }
  return instance
}