import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/res1/', // サブディレクトリにデプロイする場合のベースパス
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // 警告の上限を1MBに設定
  },
})
