import * as fs from "fs/promises";
import glob from "glob-promise";
import { parseXML } from "../xml.js";
import { Header, Link, PandocJSON } from 'pandoc-types';
import window from '@k0michi/isomorphic-dom';

const tagMap: any = {};

export function toPandocAST(node: Node | NodeList): any {
  const Node = window.Node;

  if (node instanceof Node) {
    node = node as Node;

    if (node.nodeType == Node.DOCUMENT_NODE) {
      return toPandocAST(node.childNodes);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      const element = node as Element;
      const children = [];

      for (let i = 0; i < node.childNodes.length; i++) {
        // children[i] = toPandocAST(node.childNodes[i]);

        const child = toPandocAST(node.childNodes[i]);

        if (child != null) {
          children.push(child);
        }
      }

      const props: any = {};

      for (let i = 0; i < element.attributes.length; i++) {
        if (element.attributes[i].name == 'class') {
          props['className'] = element.attributes[i].value;
        } else {
          props[element.attributes[i].name] = element.attributes[i].value;
        }
      }

      const tag = element.tagName.toLowerCase();

      switch (tag) {
        case "body":
          return children;
        case 'ul':
          return {
            t: "BulletList",
            c: children
          };
        case 'ol':
          console.log(children)
          return {
            t: "OrderedList",
            c: [[1, {
              t: "Decimal"
            }, {
                t: "Period"
              }], children]
          };
        case 'li':
          console.log(children)
          if (children[0].t == "Para") {
            return children;
          }
          return children.map((child: any) => {
            return {
              t: "Plain",
              c: [child]
            }
          });
        case "blockquote":
          return {
            t: "BlockQuote",
            c: children
          };
        case "hr":
          return {
            t: "HorizontalRule"
          };
        case 'b':
        case 'strong':
          return {
            t: "Strong",
            c: children
          };
        case 'a':
          return {
            t: "Link",
            c: [["", [], []], [
              {
                t: "Str",
                c: element.textContent!
              }
            ], [
              element.getAttribute("href")!, ""
            ]]
          } satisfies Link;
        case "math":
          if (element.getAttribute("display") == "block") {
            return {
              t: "Para",
              c: [
                {
                  t: "Math",
                  c: [
                    {
                      t: "DisplayMath",
                    },
                    element.textContent!
                  ]
                }
              ]
            };
          } else {
            return {
              t: "Math",
              c: [
                {
                  t: "InlineMath",
                },
                element.textContent!
              ]
            };
          }
        case "img":
          return {
            "t": "Figure",
            "c": [
              [
                "",
                [],
                []
              ],
              [
                null,
                [
                  {
                    "t": "Plain",
                    "c": [
                      {
                        "t": "Str",
                        "c": element.getAttribute("alt") ?? ''
                      }
                    ]
                  }
                ]
              ],
              [
                {
                  "t": "Plain",
                  "c": [
                    {
                      "t": "Image",
                      "c": [
                        [
                          "",
                          [],
                          []
                        ],
                        [
                          {
                            "t": "Str",
                            "c": element.getAttribute("alt") ?? ''
                          }
                        ],
                        [
                          element.getAttribute("src")!,
                          ""
                        ]
                      ]
                    }
                  ]
                }
              ]
            ]
          };
        case "code":
          const lang = [];

          if (element.getAttribute("lang") != null) {
            lang.push(element.getAttribute("lang")!);
          }
          if (element.getAttribute("display") == "block") {
            return {
              t: "CodeBlock",
              c: [["", lang, []], element.textContent!]
            };
          } else {
            return {
              t: "Code",
              c: [["", lang, []], element.textContent!]
            };
          }
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          const h = {
            t: "Header",
            c: [parseInt(
              tag.slice(1)
            ), ["", [], []], children]
          } satisfies Header;
          return h;
        case "p":
          return {
            t: "Para",
            c: children
          };
        default:
          if (tagMap[tag] == undefined) {
            console.log(`Skipping <${tag}>`);
            tagMap[tag] = true;
          }
          return null;
      }

      // return factory(tag, props, ...children);
    } else if (node.nodeType == Node.TEXT_NODE) {
      const text = node as Text;

      if (text.data.trim() == "") {
        return null;
      }

      return {
        t: "Str",
        c: text.data.trim()
      }
    } else {
      throw new Error();
    }
  } else {
    node = node as NodeList;
    const children = [];

    for (let i = 0; i < node.length; i++) {
      const child = toPandocAST(node[i]);

      if (child != null) {
        children.push(child);
      }
    }

    return children;
  }
}

import child_process from "child_process";
import { transformCode, transformMath } from "../ktml.js";

function pandoc(options: string[], stdin: string) {
  return new Promise<string>((resolve, reject) => {
    const proc = child_process.spawn("pandoc", options);
    let result = "";

    proc.stdout.on("data", (data) => {
      result += data;
    });

    proc.stderr.on("data", (data) => {
      console.error(data.toString('utf-8'));
    });

    proc.on("close", (code) => {
      if (code == 0) {
        resolve(result);
      } else {
        reject(new Error(`pandoc exited with code ${code}`));
      }
    });

    proc.stdin.write(stdin);
    proc.stdin.end();
  });
}

(async () => {
  const files = await glob("contents/log/**/*.ktml");

  for (const file of files) {
    console.log(file);
    const content = await fs.readFile(file, "utf-8");
    const parsed = parseXML(content);
    transformCode(parsed.querySelector("body")!);
    transformMath(parsed.querySelector("body")!);
    let converted = toPandocAST(parsed.querySelector("body")!);
    converted = {
      "pandoc-api-version": [1, 23, 0, 1],
      meta: {},
      blocks: converted
    };
    const stringified = JSON.stringify(converted);
    // console.log(stringified);
    await fs.writeFile(file.replace(/\.ktml$/, ".json"), stringified);
    const md = await pandoc(["-f", "json", "-t", "markdown"], stringified);
    await fs.writeFile(file.replace(/\.ktml$/, ".md"), md);
    // const ast = toPandocAST();
    // const dest = file.replace(/\.ktml$/, ".md");
    // await fs.writeFile(dest, md);
  }
})();