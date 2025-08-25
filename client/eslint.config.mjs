// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Next 권장 설정 + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 무시 경로
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },

  // 규칙 커스터마이즈
  {
    rules: {
      // 기본 JS 규칙은 끄고, TS 전용 규칙을 사용 (중복 경고 방지)
      "no-unused-vars": "off",

      // _ 프리픽스면 미사용 인자/변수/에러 허용
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
        },
      ],
    },
  },
];

export default config;
