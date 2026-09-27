// Vite 环境变量类型声明（vite/client 未随依赖暴露，手动声明）
interface ImportMetaEnv {
  readonly [key: string]: any;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_BETTER_STACK_STATUS_PAGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
