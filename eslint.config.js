import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier' // 明确引入插件

export default defineConfig([
  {
    files: ['**/*.{js,mjs,jsx,vue}'], // 作用于所有目标文件
    languageOptions: {
      globals: {
        ...globals.browser,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue, // 注册 Vue 插件
      prettier: prettierPlugin // 注册 Prettier 插件（必须）
    },
    rules: {
      // 明确开启 prettier 规则，级别设为 "error" 或 "warn"（才能被修复）
      'prettier/prettier': [
        'warn', // 建议用 "error"，优先级更高
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ],
      // 其他规则...
      'vue/multi-word-component-names': ['warn', { ignores: ['index'] }],
      'vue/no-setup-props-destructure': ['off'],
      'no-undef': 'error'
    }
  },
  // 引入基础规则集
  js.configs.recommended,
  ...pluginVue.configs['flat/essential']
])
