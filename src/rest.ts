import ky from 'ky-universal';
import * as restTypes from './types/rest';

const DEFAULT_BASE_URL = 'https://sideshift.ai/api/';

export type RestClientOptions = {
  /**
   * Base url for the API. Defaults to https://sideshift.ai/api/
   */
  baseUrl: string;
  /**
   * SideShift.ai secret. Obtain from visiting https://sideshift.ai/affiliate and clicking SHOW AFFILIATE SECRET.
   */
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

  /**
   * Retrieve information about the specified shift pair
   * @param depositMethodId The deposit method
   * @param settleMethodId The settle method
   */
  const getPair = (depositMethodId: string, settleMethodId: string) =>
    request<restTypes.GetPairResponse>(
      'GET',
      `pairs/${depositMethodId}/${settleMethodId}`,
    );

  const getFacts = () => request<restTypes.GetFactsResponse>('GET', `facts`);

  /**
   * Retrieve a list of assets, such as `BTC` and `XMR`. Shortcut for `getFacts`.
   */
  const getAssets = () => getFacts().then((facts) => facts.assets);

  /**
   * Retrieve a list of deposit methods, such as `ln` or `bch`. Shortcut for `getFacts`
   */
  const getDepositMethods = () =>
    getFacts().then((facts) => facts.depositMethods);

  /**
   * Retrieve a list of settle methods, such as `xmr` or `bch`. Shortcut for `getFacts`
   */
  const getSettleMethods = () =>
    getFacts().then((facts) => facts.settleMethods);

  /**
   * Create an order
   */
  const createOrder = (fields: restTypes.CreateOrderInput) =>
    request<restTypes.CreateOrderResponse>('POST', `orders`, fields);

  /**
   * Fetch an order by its id
   * @param id Order id
   */
  const getOrder = (id: string) =>
    request<restTypes.GetOrderResponse>('GET', `orders/${id}`);

  return {
    request,
    getPair,
    getFacts,
    createOrder,
    getAssets,
    getDepositMethods,
    getSettleMethods,
    getOrder,
  };
};

export type RestClient = ReturnType<typeof createClient>;
