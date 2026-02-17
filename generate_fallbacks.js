import fs from 'node:fs'

let changed = 0;

const rp = "./resource_pack/assets/stellarity/lang/en_us.json"
const translations = JSON.parse(fs.readFileSync(rp, 'utf-8'))

function go(root) {
    if (root === './recipes') return;

    console.log(root)

    const files = fs.readdirSync(root)

    for (const file of files) {
        const full = root + '/' + file
        if (file.match('\.js$')) continue
        if (!file.match('\.json'))  go(full)
        else {
            console.log('Parsing', full)
            const data = JSON.parse(fs.readFileSync(full, 'utf-8'))
            if (data.display?.announce_to_chat) {
                console.log('Shows in chat', full)
                if (!data.display.title?.translate) {
                    console.log("Doesn't use translation key:", full)
                    continue
                }
                const key = data.display.title.translate

                const fallback = translations[key]
                if (!fallback) throw new Error("Couldn't extract en_us translation for" + full)

                data.display.title = {
                    ...data.display.title,
                    fallback
                }

                fs.writeFileSync(full, JSON.stringify(data, null, 2))
            }
        }
    }
}

go("./datapack/data/stellarity/advancement")
