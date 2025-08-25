import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Next 권장 설정 + TS
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  // 무시 경로
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts"
    ]
  },

  // 규칙/플러그인
  {
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    rules: {
      // 기본 JS 규칙 비활성화 → TS 전용 사용
      "no-unused-vars": "off",

      // _ 프리픽스면 미사용 인자/변수/에러 허용
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],

      "no-console": ["warn", { allow: ["warn", "error"] }],

      // import 정렬
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
            "type"
          ]
        }
      ]
    }
  }
];

export default config;
