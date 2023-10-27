import { transform } from "./src/index.js";
import { dedent } from "@qnighy/dedent";

const content = dedent`\
  - term 1:
    - details 1
    - details 2
    * details 3
    * details 4
  - term 2:
    - details 3
`;

console.dir(transform(content), { depth: null });
