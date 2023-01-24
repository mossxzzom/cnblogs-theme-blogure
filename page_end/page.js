
function LoadPage() {
    const vm = window.vm
    const page = (vm.page = {})
    const originBody = vm.metadata
    page.pages = []
    page.async = {}
    if (!((originBody.querySelector('.Pager, .pager') || originBody.querySelector('#nav_next_page a')))) {
        console.log(page)
        return page
    }
    const pagerdom = originBody.querySelector('.Pager') ? originBody.querySelector('.Pager') : originBody.querySelector('.pager')
    if (pagerdom) {
        const pagenodes = pagerdom.childNodes
        for (let index = 0; index < pagenodes.length; index++) {
            const pagenode = pagenodes[index]
            if (pagenode.textContent.trim() == '') continue
            const p = {}
            p.desc = pagenode.textContent.trim()
            p.url = pagenode.href ? pagenode.href.trim() : ''
            page.pages.push(p)
        }
        console.log(page)
        return page
    }
    page.async.pagePromise = Get(originBody.querySelector('#nav_next_page a').href.trim())
    page.async.pages = false
    page.async.pagePromise.then(((page) => {
        return (r) => {
            const tempdom = document.createElement('html')
            tempdom.innerHTML = r.responseText
            const pagenodes = tempdom.querySelector('.Pager, .pager').childNodes
            for (let index = 0; index < pagenodes.length; index++) {
                const pagenode = pagenodes[index]
                if (pagenode.textContent.trim() == '') continue
                const p = {}
                p.desc = pagenode.textContent.trim()
                p.url = pagenode.href ? pagenode.href.trim() : ''
                page.pages.push(p)
            }
            page.pages.shift() // const('上一页')
            if (page.pages.length == 2) page.pages.push({ 'desc': '下一页', url: r.responseURL })
            [page.pages[0], page.pages[1]] = [page.pages[1], page.pages[2]]
            page.pages[0].desc = '1'
            page.pages[0].url = ''
            page.pages[1].desc = '2'
            page.pages[1].url = r.responseURL
            page.async.pages = true
        }
    })(vm.page))
    console.log(page)
}