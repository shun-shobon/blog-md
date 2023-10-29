import type * as Mdast from "mdast";
import { match, P } from "ts-pattern";

import type * as AST from "../../ast.js";
import { unreachable } from "../../error.js";
import type { Extension, MdastHandler } from "../extension.js";

export function code(): Extension {
  return {
    handlers: {
      code: codeNode,
    },
  };
}

const codeNode: MdastHandler<Mdast.Code> = (node) => {
  const infoStr = [node.lang, node.lang]
    .filter((s) => s !== undefined)
    .join(" ");

  const [langDiff, filename] = infoStr.split(":", 2);
  if (langDiff === undefined) unreachable();
  const [lang, diff] = match(
    langDiff.split(" ", 2) as [string, string] | [string],
  )
    .returnType<[lang: string | undefined, diff: boolean]>()
    .with(["diff", P.string], ([_, lang]) => [lang, true])
    .with([P.string, P.string], ([lang1, lang2]) => [
      `${lang1} ${lang2}`,
      false,
    ])
    .with([""], () => [undefined, false])
    .with([P.string], ([lang]) => [lang, false])
    .exhaustive();

  const code: AST.Code = {
    type: "code",
    lang,
    filename,
    diff,
    value: node.value,
    position: node.position,
  };
  return code;
};
