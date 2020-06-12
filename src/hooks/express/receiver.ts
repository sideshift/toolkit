import {
  CreateHooksMiddlewareOptions,
  createHooksMiddleware,
} from './middleware';

export type CreateHooksReceiverOptions = CreateHooksMiddlewareOptions & {
  /**
   * Port number the hooks receiver will listen for HTTP requests from SideShift.ai
   */
  port: number;
};

export type HooksReceiver = {
  stop: () => void;
};

export const createHooksReceiver = (
  options: CreateHooksReceiverOptions,
): HooksReceiver => {
  const opts = { ...options };

  const app = createHooksMiddleware(opts);
  const server = app.listen(opts.port);

  return {
    stop: (): void => {
      server.close();
    },
  };
};
