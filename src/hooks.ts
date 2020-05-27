import { createHmac } from 'crypto';
import asyncHandler from 'express-async-handler';
import express from 'express';
import bodyParser from 'body-parser';
import {
  OrderCreateHookDelivery,
  OrderUpdateHookDelivery,
  DepositCreateHookDelivery,
  DepositUpdateHookDelivery,
  PingHookDelivery,
  HookEventType,
} from './types';

const SIGNATURE_LENGTH = 128;

export const getDeliverySignature = (
  secret: string,
  body: Buffer | string | unknown,
): string => {
  if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
    return getDeliverySignature(JSON.stringify(body), secret);
  }

  return createHmac('sha512', secret).update(body).digest('hex');
};

export const verifyDeliverySignature = (
  secret: string,
  body: Buffer | string | unknown,
  signature: string,
): void => {
  if (signature.length !== 128) {
    throw new Error(
      `Invalid signature length ${signature.length}. Expected ${SIGNATURE_LENGTH}`,
    );
  }

  const actualSignature = getDeliverySignature(secret, body);

  if (actualSignature !== signature) {
    throw new Error(`Incorrect signature`);
  }
};

export type CreateHooksReceiverOptions = {
  /**
   * Port number the hooks receiver will listen for HTTP requests from SideShift.ai
   */
  port: number;
  /**
   * SideShift.ai secret. Obtain from visiting https://sideshift.ai/affiliate and clicking SHOW AFFILIATE SECRET.
   */
  secret: string;
  onOrderCreate?: (
    message: OrderCreateHookDelivery,
  ) => PromiseLike<void> | void;
  onOrderUpdate?: (
    message: OrderUpdateHookDelivery,
  ) => PromiseLike<void> | void;
  onDepositCreate?: (
    message: DepositCreateHookDelivery,
  ) => PromiseLike<void> | void;
  onDepositUpdate?: (
    message: DepositUpdateHookDelivery,
  ) => PromiseLike<void> | void;
  onPing?: (message: PingHookDelivery) => PromiseLike<void> | void;
};

export type HooksReceiver = {
  stop: () => void;
};

export const createHooksReceiver = (
  options: CreateHooksReceiverOptions,
): HooksReceiver => {
  const opts = { ...options };

  const app = express();

  // Verify signature
  app.use(
    bodyParser.json({
      verify: (
        req: express.Request & { rawBody: Buffer },
        res: express.Response,
        buffer: Buffer,
      ) => {
        const signature = req.header('x-sai-signature');

        if (!signature) {
          res.status(400).send('Signature header missing').end();
          return;
        }

        try {
          verifyDeliverySignature(opts.secret, buffer, signature);
        } catch (error) {
          res.status(400).send(error.message).end();
        }
      },
    }),
  );

  // Receive hooks
  app.post(
    '/',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      if (typeof req.body !== 'object') {
        res.status(400).end('Request body missing');
        return;
      }

      const { body } = req;

      try {
        if (body.type === HookEventType.depositCreate && opts.onDepositCreate) {
          await opts.onDepositCreate(body);
        }

        if (body.type === HookEventType.depositUpdate && opts.onDepositUpdate) {
          await opts.onDepositUpdate(body);
        }

        if (body.type === HookEventType.orderCreate && opts.onOrderCreate) {
          await opts.onOrderCreate(body);
        }

        if (body.type === HookEventType.orderUpdate && opts.onOrderUpdate) {
          await opts.onOrderUpdate(body);
        }

        if (body.type === HookEventType.ping && opts.onPing) {
          await opts.onPing(body);
        }
      } catch (error) {
        res.status(500).send(error.message).end();

        throw error;
      }

      res.status(200).send('OK').end();
    }),
  );

  const server = app.listen(opts.port);

  return {
    stop: (): void => {
      server.close();
    },
  };
};
