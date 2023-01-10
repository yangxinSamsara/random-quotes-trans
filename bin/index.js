#! /usr/bin/env node

const colors = require("colors")
const yargs = require("yargs")
const superagent = require("superagent")
const query = encodeURI(yargs.argv._.join(" "))
const agent = superagent.agent()
if (query) {
  console.log("不需要参数".red)
} else {
  qt()
}

function qt() {
  agent.get("https://api.quotable.io/random").then((res) => {
    const { content, author } = res.body
    format(author, content)
  })
}

function format(author, content) {
  Promise.all([translate(author), translate(content)]).then((res) => {
    console.log("名言警句".red)
    console.log(`${res[1].en}`.blue + "——".yellow + `${res[0].en}`.red)
    console.log(`${res[1].zh.join("")}`.blue + "——".yellow + `${res[0].zh}`.red)
  })
}

function translate(str) {
  return new Promise((resolve, reject) => {
    agent
      .get("http://aidemo.youdao.com/trans")
      .query({
        q: str,
        from: "Auto",
        to: "Auto",
      })
      .then((res) => {
        const text = JSON.parse(res.text)
        const obj = { en: text.query, zh: text.translation }
        resolve(obj)
      })
  })
}
