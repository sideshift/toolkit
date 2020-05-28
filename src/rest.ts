import ky from 'ky-universal';
import * as restTypes from './types/rest';

const DEFAULT_BASE_URL = 'https://sideshift.ai/api/';

export type RestClientOptions = {
  baseUrl: string;
  secret?: string;
};

export const createClient = (options: Partial<RestClientOptions>) => {
  const opts = {
    baseUrl: DEFAULT_BASE_URL,
    ...options,
  };

  const api = ky.extend({
    prefixUrl: opts.baseUrl,
    hooks: {
      beforeRequest: [
        (request) => {
          if (opts.secret) {
            request.headers.set('X-Sai-Session-Secret', opts.secret);
          }
        },
      ],
    },
  });

  const request = async <T>(
    method: string,
    path: string,
    fields?: unknown,
  ): Promise<T> => {
    try {
      const json = await api(path, {
        method,
        headers: {
          cookie: 'country-override=XX',
        },
        ...(fields ? { json: fields } : {}),
      }).json();

      return json as T;
    } catch (error) {
      if (error.response) {
        const json = await error.response?.json();

        const message =
          json?.error?.message ||
          (json && JSON.stringify(json)) ||
          error.message;

        throw new Error(`HTTP ${error.response.status}: ${message}`);
      }

      throw error;
    }
  };

  const getPair = (depositMethodId: string, settleMethodId: string) =>
    request<restTypes.GetPairResponse>(
      'GET',
      `pairs/${depositMethodId}/${settleMethodId}`,
    );

  const getFacts = () => request<restTypes.GetFactsResponse>('GET', `facts`);

  const createOrder = (fields: restTypes.CreateOrderInput) =>
    request<restTypes.CreateOrderResponse>('POST', `orders`, fields);

  return {
    request,
    getPair,
    getFacts,
    createOrder,
  };
};
