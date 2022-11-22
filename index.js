const p = require("puppeteer");
const fs = require("fs");
const yt = require("ytfps");
const download = require('download');

const sleep = async (m) =>{
    return new Promise((res)=>{
        setTimeout(res,m)
    })
}
const main = async () => {
    const list = await yt("PLybg94GvOJ9FoGQeUMFZ4SWZsr30jlUYK");
    list.videos = list.videos.slice(163);

    const b = await p.launch();
    const page = await b.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")
    // for(let l of list){
        // await page.goto("https://downsub.com/?url=" + encodeURIComponent(list.videos[0].url));
        // await page.waitForXPath(`//*[@id="app"]/div/main/div/div[2]/div/div[1]/div[1]/div[2]/div[12]/button[1]`);
        page.on("request",async (req)=>{
            const url = req.url();
            if(url.includes(".downsub.com/?title=")){
                const U = new URL(url);
                const pa = new URLSearchParams(U.searchParams).get("title");
                console.log("start", pa)
                fs.writeFile("./subs/" + pa + ".srt",await download(url), (err)=>{
                    if(!err){ console.log("ok") } 
                });
            }
        })
        await sleep(3000);
        for(let l of list.videos){
            await page.goto("https://downsub.com/?url=" + encodeURIComponent(l.url));
            await page.waitForXPath(`//*[@id="app"]/div/main/div/div[2]/div/div[1]/div[1]/div[2]/div[12]/button[1]`);
            await page.evaluate(`document.querySelectorAll(".download-button").forEach((v)=>{
                if(v.getAttribute("data-title") === "[SRT] Persian"){
                    v.click();
                }
            })`)
            // await (await page.$x(`/html/body/div[1]/div/main/div/div[2]/div/div[1]/div[1]/div[2]/div[97]/button[1]`))[0]
        }
        
    // }
    
}

main();